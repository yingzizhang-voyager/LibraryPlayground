import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Components/File Upload",
  component: FileUpload,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

/* ── helpers ──────────────────────────────────────────────── */
const MOCK_PDF = new File(["content"], "Lease-agreement.pdf", { type: "application/pdf" });
Object.defineProperty(MOCK_PDF, "size", { value: 184320 });

/* ── stories ──────────────────────────────────────────────── */

export const Empty: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload>
        <FileUpload.Zone accept=".pdf,.doc,.docx" />
      </FileUpload>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null);
    return (
      <div className="w-[32rem]">
        <FileUpload value={file} onValueChange={setFile}>
          <FileUpload.Zone accept=".pdf,.doc,.docx" />
        </FileUpload>
      </div>
    );
  },
};

export const Uploaded: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload value={MOCK_PDF}>
        <FileUpload.Zone accept=".pdf,.doc,.docx" />
      </FileUpload>
    </div>
  ),
};

export const Uploading: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload value={MOCK_PDF} loading>
        <FileUpload.Zone accept=".pdf,.doc,.docx" />
      </FileUpload>
    </div>
  ),
};

export const ErrorEmpty: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload>
        <FileUpload.Zone accept=".pdf,.doc,.docx" error="Required field" />
      </FileUpload>
    </div>
  ),
};

export const ErrorFilled: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload value={MOCK_PDF}>
        <FileUpload.Zone accept=".pdf,.doc,.docx" error="Unsupported file type" />
      </FileUpload>
    </div>
  ),
};

export const CannotRemove: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload value={MOCK_PDF} disabled>
        <FileUpload.Zone accept=".pdf,.doc,.docx" />
      </FileUpload>
    </div>
  ),
};

export const DisabledEmpty: Story = {
  render: () => (
    <div className="w-[32rem]">
      <FileUpload disabled>
        <FileUpload.Zone accept=".pdf,.doc,.docx" />
      </FileUpload>
    </div>
  ),
};
