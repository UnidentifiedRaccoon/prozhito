import type { Meta, StoryObj } from "@storybook/react-vite";
import { DecisionChain, type DecisionChainItem } from "./DecisionChain";

const exampleItems = [
  {
    "label": "Ситуация",
    "description": "За комнату нужно заплатить за два дня до зарплаты. У Саши есть наличные и деньги на счёте, но компенсация придёт позже, а транспортный баланс для этой оплаты не подходит."
  },
  {
    "label": "Эмоция",
    "description": "Растерянность: после переезда нужно разобраться сразу с несколькими сроками и платежами."
  },
  {
    "label": "Импульс",
    "description": "Посчитать всё вместе — наличные, остатки и будущие поступления — и решить, что на оплату хватит."
  },
  {
    "label": "Пауза",
    "description": "Саша открывает календарь и сравнивает день оплаты с днём зарплаты."
  },
  {
    "label": "Риск",
    "description": "Не иметь нужных денег к дате оплаты, если рассчитывать на позднюю компенсацию или транспортный баланс."
  },
  {
    "label": "Осознание",
    "description": "Для оплаты важна не только общая сумма, но и то, когда деньги будут доступны и можно ли ими заплатить за комнату."
  },
  {
    "label": "Инструмент",
    "description": "Календарь с датами оплаты и зарплаты и переписка с Тамарой, в которой можно зафиксировать договорённость."
  },
  {
    "label": "Действие",
    "description": "Саша заранее просит Тамару перенести оплату на день зарплаты и записывает новую дату после её согласия."
  },
  {
    "label": "Результат",
    "description": "Тамара согласилась на перенос. Новая дата оплаты зафиксирована в переписке."
  }
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
