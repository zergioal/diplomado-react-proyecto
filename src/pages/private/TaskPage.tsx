import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  RadioButtonUnchecked as PendingIcon,
} from '@mui/icons-material';
import { useAlert, useAxios } from '../../hooks';
import type { Task, TasksResponse } from '../../interfaces';
import { schemaTask, type TaskFormValues } from '../../models';
import { handleZodErros } from '../../helpers';
import type { ActionState } from '../../interfaces';

type TaskActionState = ActionState<TaskFormValues>;

const emptyState: TaskActionState = { errors: {}, message: '' };

export const TaskPage = () => {
  const axios = useAxios();
  const { showAlert } = useAlert();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog: create / edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formState, setFormState] = useState<TaskActionState>(emptyState);
  const [saving, setSaving] = useState(false);

  // Dialog: confirm delete
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<TasksResponse>('/tasks', {
        params: { limit: 100, orderDir: 'DESC' },
      });
      setTasks(response.data.data);
    } catch {
      showAlert('Error al cargar las tareas', 'error');
    } finally {
      setLoading(false);
    }
  }, [axios, showAlert]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- Create / Edit dialog helpers ---

  const openCreate = () => {
    setEditingTask(null);
    setFormState(emptyState);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormState(emptyState);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingTask(null);
    setFormState(emptyState);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData: TaskFormValues = { name: formData.get('name') as string };

    const parsed = schemaTask.safeParse(rawData);
    if (!parsed.success) {
      setFormState(handleZodErros<TaskFormValues>(parsed.error, rawData));
      return;
    }

    setSaving(true);
    try {
      if (editingTask) {
        await axios.put(`/tasks/${editingTask.id}`, { name: parsed.data.name });
        showAlert('Tarea actualizada', 'success');
      } else {
        await axios.post('/tasks', { name: parsed.data.name });
        showAlert('Tarea creada', 'success');
      }
      setDialogOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch {
      showAlert('Error al guardar la tarea', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Toggle done ---

  const handleToggle = async (task: Task) => {
    try {
      await axios.patch(`/tasks/${task.id}`, { done: !task.done });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
      );
    } catch {
      showAlert('Error al actualizar el estado', 'error');
    }
  };

  // --- Delete ---

  const confirmDelete = (task: Task) => setDeleteTarget(task);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`/tasks/${deleteTarget.id}`);
      showAlert('Tarea eliminada', 'success');
      setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      showAlert('Error al eliminar la tarea', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // --- Render ---

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Mis Tareas
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nueva Tarea
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            No tienes tareas aún.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
            Crear primera tarea
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tarea</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{ opacity: task.done ? 0.6 : 1 }}
                >
                  <TableCell>
                    <Typography
                      sx={{
                        textDecoration: task.done ? 'line-through' : 'none',
                        color: task.done ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {task.name}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={task.done ? 'Finalizada' : 'Pendiente'}
                      color={task.done ? 'success' : 'warning'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title={task.done ? 'Marcar pendiente' : 'Marcar finalizada'}>
                      <IconButton
                        size="small"
                        color={task.done ? 'success' : 'default'}
                        onClick={() => handleToggle(task)}
                      >
                        {task.done ? <CheckIcon /> : <PendingIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openEdit(task)}
                        disabled={task.done}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => confirmDelete(task)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* FAB flotante alternativo (pantallas pequeñas) */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 32, right: 32, display: { sm: 'none' } }}
        onClick={openCreate}
      >
        <AddIcon />
      </Fab>

      {/* ---- Dialog Crear / Editar ---- */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{editingTask ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              name="name"
              label="Nombre de la tarea"
              type="text"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={saving}
              defaultValue={editingTask?.name ?? ''}
              error={!!formState.errors.name}
              helperText={formState.errors.name}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialog} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {saving ? 'Guardando...' : editingTask ? 'Guardar cambios' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ---- Dialog Confirmar Eliminar ---- */}
      <Dialog open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)}>
        <DialogTitle>Eliminar tarea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar <strong>"{deleteTarget?.name}"</strong>? Esta
            acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
