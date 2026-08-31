CREATE SCHEMA IF NOT EXISTS prozhito;
REVOKE ALL ON SCHEMA prozhito FROM PUBLIC;
SET search_path = prozhito, pg_catalog;

CREATE TABLE editors (
  id uuid PRIMARY KEY,
  login text NOT NULL UNIQUE CHECK (login ~ '^[a-zA-Z0-9_.-]{3,64}$'),
  password_hash text NOT NULL,
  last_totp_step bigint NOT NULL DEFAULT -1,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE editor_sessions (
  token_hash text PRIMARY KEY,
  editor_id uuid NOT NULL REFERENCES editors(id),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX editor_sessions_editor_idx ON editor_sessions(editor_id);
CREATE INDEX editor_sessions_expiry_idx ON editor_sessions(expires_at);
CREATE TABLE login_attempts (
  key_hash text PRIMARY KEY,
  attempts integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL
);
CREATE INDEX login_attempts_expiry_idx ON login_attempts(reset_at);
CREATE TABLE levels (
  id text PRIMARY KEY,
  position integer NOT NULL UNIQUE CHECK(position BETWEEN 1 AND 6),
  title text NOT NULL
);
CREATE TABLE sections (
  id text PRIMARY KEY CHECK(id ~ '^L0[1-6]-S0[1-4]$'),
  level_id text NOT NULL REFERENCES levels(id),
  position integer NOT NULL CHECK(position BETWEEN 1 AND 4),
  UNIQUE(level_id, position)
);
CREATE TABLE revisions (
  id uuid PRIMARY KEY,
  section_id text NOT NULL REFERENCES sections(id),
  document jsonb NOT NULL CHECK(jsonb_typeof(document) = 'object'),
  editor_id uuid REFERENCES editors(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(section_id, id)
);
CREATE INDEX revisions_section_created_idx ON revisions(section_id, created_at DESC);
CREATE INDEX revisions_editor_idx ON revisions(editor_id);
CREATE TABLE drafts (
  section_id text PRIMARY KEY REFERENCES sections(id),
  base_revision_id uuid NOT NULL,
  version integer NOT NULL DEFAULT 1,
  document jsonb NOT NULL,
  editor_id uuid NOT NULL REFERENCES editors(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(section_id,base_revision_id) REFERENCES revisions(section_id,id)
);
CREATE INDEX drafts_editor_idx ON drafts(editor_id);
CREATE TABLE publications (
  id uuid PRIMARY KEY,
  sequence bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  editor_id uuid REFERENCES editors(id),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX publications_editor_idx ON publications(editor_id);
CREATE TABLE publication_items (
  publication_id uuid NOT NULL REFERENCES publications(id),
  section_id text NOT NULL,
  revision_id uuid NOT NULL,
  PRIMARY KEY(publication_id, section_id),
  FOREIGN KEY(section_id,revision_id) REFERENCES revisions(section_id,id)
);
CREATE INDEX publication_items_revision_idx ON publication_items(section_id,revision_id);
CREATE TABLE current_publication (
  singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
  publication_id uuid NOT NULL REFERENCES publications(id)
);
CREATE TABLE editorial_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  editor_id uuid REFERENCES editors(id),
  action text NOT NULL,
  section_id text REFERENCES sections(id),
  publication_id uuid REFERENCES publications(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX editorial_audit_editor_idx ON editorial_audit(editor_id);
CREATE INDEX editorial_audit_section_idx ON editorial_audit(section_id);
CREATE INDEX editorial_audit_publication_idx ON editorial_audit(publication_id);

-- Explicit runtime grants: the app cannot mutate historical revisions or DDL.
GRANT USAGE ON SCHEMA prozhito TO prozhito_app;
GRANT SELECT ON ALL TABLES IN SCHEMA prozhito TO prozhito_app;
GRANT INSERT ON revisions, publications, publication_items, editorial_audit TO prozhito_app;
GRANT INSERT, UPDATE, DELETE ON drafts, editor_sessions, login_attempts TO prozhito_app;
GRANT UPDATE ON current_publication TO prozhito_app;
GRANT UPDATE (last_totp_step) ON editors TO prozhito_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA prozhito TO prozhito_app;
