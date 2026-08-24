import { AppShell } from "../components/AppShell";
import { Button } from "../components/ui/Button/Button";
import { Heading } from "../components/ui/Heading/Heading";
import { Text } from "../components/ui/Text/Text";
import { catalogHref } from "../router";

export function NotFoundScreen() {
  return (
    <AppShell
      className="message-screen"
      pageTitle="Страница не найдена"
      routeKey="not-found"
    >
      <Heading as="h1" variant="page">
        Страница не найдена
      </Heading>
      <Text>Эта ссылка не ведёт ни к одной Section демоверсии.</Text>
      <Button href={catalogHref}>Вернуться к списку</Button>
    </AppShell>
  );
}
