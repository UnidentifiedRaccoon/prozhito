import type { Meta, StoryObj } from "@storybook/react-vite";
import { DecisionChain, type DecisionChainItem } from "./DecisionChain";

const exampleItems = [
  {
    label: "Ситуация",
    description:
      "Саше нужно внести плату за комнату за два дня до первой полной зарплаты. Видимые ресурсы отличаются по дате доступности, форме и пригодности для этого платежа.",
  },
  {
    label: "Эмоция",
    description:
      "Растерянность: несколько сроков и форм денег накладываются друг на друга.",
  },
  {
    label: "Импульс",
    description:
      "Сложить все видимые и ожидаемые ресурсы и сразу считать, что общей суммы достаточно.",
  },
  {
    label: "Риск",
    description:
      "Принять ещё недоступный или неподходящий по форме ресурс за деньги, которыми уже можно заплатить к сроку.",
  },
  {
    label: "Пауза",
    description:
      "Саша сопоставляет даты в календаре и не считает срок изменённым до ответа Тамары.",
  },
  {
    label: "Осознание",
    description:
      "Сумма сама по себе не отвечает на вопрос о платеже: важны дата доступности ресурса, его форма и пригодность для конкретной оплаты.",
  },
  {
    label: "Инструмент",
    description:
      "Календарь для сопоставления сроков и письменная переписка для фиксации явного ответа.",
  },
  {
    label: "Зрелое действие",
    description:
      "До срока Саша обращается к Тамаре и записывает новую дату только после её явного согласия.",
  },
  {
    label: "Наблюдаемый результат",
    description:
      "Новая дата согласована и зафиксирована в переписке. Совершение платежа в истории не показано.",
  },
] as const satisfies readonly DecisionChainItem[];

const meta = {
  title: "Product/DecisionChain",
  component: DecisionChain,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Девятизвенная причинная цепочка разбора решения. Визуальная нумерация скрыта, но компонент сохраняет семантический упорядоченный список.",
      },
    },
  },
  args: {
    items: exampleItems,
  },
} satisfies Meta<typeof DecisionChain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
