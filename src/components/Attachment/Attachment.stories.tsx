import type { Meta, StoryObj } from "@storybook/react";
import { Attachment } from "./Attachment";

const meta: Meta<typeof Attachment> = {
  title: "Components/Attachment",
  component: Attachment,
  parameters: { layout: "padded" },
  argTypes: {
    error: { control: "text" },
    loading: { control: "boolean" },
    onRemove: { action: "remove" },
    onRetry: { action: "retry" },
  },
};
export default meta;
type Story = StoryObj<typeof Attachment>;

export const View: Story = {
  args: {
    fileName: "Q4 Report.pdf",
    fileSize: "1.2 MB",
    onRemove: () => {},
  },
};

export const Hover: Story = {
  args: { ...View.args },
  parameters: { pseudo: { hover: true } },
};

export const Uploading: Story = {
  args: {
    fileName: "presentation.pptx",
    fileSize: "4.7 MB",
    loading: true,
  },
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    fileName: "contract.pdf",
    fileSize: "800 KB",
    error: "Upload failed",
    onRetry: () => {},
    onRemove: () => {},
  },
};

export const ErrorCustomMessage: Story = {
  args: {
    fileName: "image.jpg",
    error: "File too large (max 10 MB)",
    onRemove: () => {},
  },
};

export const ImageFile: Story = {
  args: {
    fileName: "screenshot.png",
    fileSize: "340 KB",
    onRemove: () => {},
  },
};

export const DocFile: Story = {
  args: {
    fileName: "proposal.docx",
    fileSize: "92 KB",
    onRemove: () => {},
  },
};

export const NoRemove: Story = {
  args: {
    fileName: "readonly-attachment.pdf",
    fileSize: "2.1 MB",
  },
};

export const List: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1">
      <Attachment fileName="Q4 Report.pdf" fileSize="1.2 MB" onRemove={() => {}} />
      <Attachment fileName="photo.png" fileSize="340 KB" onRemove={() => {}} />
      <Attachment fileName="contract.docx" fileSize="92 KB" loading />
      <Attachment fileName="failed.pdf" error="Upload failed" onRetry={() => {}} onRemove={() => {}} />
    </div>
  ),
};
