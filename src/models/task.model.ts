import { z } from 'zod';

export const schemaTask = z.object({
  name: z.string().min(1, 'El nombre de la tarea es obligatorio').trim(),
});

export type TaskFormValues = z.infer<typeof schemaTask>;
