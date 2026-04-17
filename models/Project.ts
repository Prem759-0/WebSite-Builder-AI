import { Schema, model, models } from 'mongoose';

const fileSchema = new Schema(
  {
    path: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true }
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    files: { type: [fileSchema], required: true }
  },
  { timestamps: true }
);

export const ProjectModel = models.Project || model('Project', projectSchema);
