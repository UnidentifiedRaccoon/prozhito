import { AppShell } from "../components/AppShell";
import { Heading } from "../components/ui/Heading/Heading";
import { Text } from "../components/ui/Text/Text";

interface ContentErrorScreenProps {
  error: Error;
}

export function ContentErrorScreen({ error }: ContentErrorScreenProps) {
  return (
    <AppShell
      className="message-screen"
      pageTitle="Ошибка контента"
      routeKey="content-error"
    >
      <Heading as="h1" variant="page">
        Ошибка контракта контента
      </Heading>
      <Text>
        Один из Markdown-файлов Section не прошёл обязательную проверку двух
        экранов и девяти звеньев.
      </Text>
      <pre>{error.message}</pre>
    </AppShell>
  );
}
