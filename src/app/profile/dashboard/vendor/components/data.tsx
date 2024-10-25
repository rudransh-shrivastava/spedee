import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const statuses = [
  {
    value: "PENDING",
    label: "Pending",
    icon: StopwatchIcon,
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    icon: CheckCircledIcon,
  },
  {
    value: "CANCELED",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: QuestionMarkCircledIcon,
  },
];
