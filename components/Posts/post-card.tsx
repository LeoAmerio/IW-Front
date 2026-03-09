import { Posteo, User } from "@/interfaces/types";
import React, { useCallback, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardTitle } from "../ui";
import Link from "next/link";
import { usePostStore } from "@/store/post-store";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  SelectChangeEvent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import { motion } from "framer-motion";
// import { useAuthStore } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import { truncateDescription } from "../helpers/helpers";
import { useMenuActions } from "../hooks/useMenuActions";
import VerticalMenu from "../VerticalMenu/vertical-menu";
import { useDeletePost } from "../hooks/useDeletePost";
import { useReportPost } from "../hooks/useReportPost";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

enum TipoDenuncia {
  SPAM = "SPAM",
  ACOSO = "ACOSO",
  CONTENIDO_INDEBIDO = "CONTENIDO INDEBIDO",
}

// Mapeo de valores del select a los valores esperados por el backend
const tipoDenunciaMap = {
  spam: TipoDenuncia.SPAM,
  acoso: TipoDenuncia.ACOSO,
  'contenido indebido': TipoDenuncia.CONTENIDO_INDEBIDO,
};

interface PostCardProps {
  posteo: Posteo;
  onEdit: (Posteo: Posteo) => void;
}

const fetchUserById = async (user_id: number): Promise<User> => {
  const response = await fetch(
    `https://ucse-iw-2024.onrender.com/auth/usuarios/${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${Cookies.get("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }

  return response.json();
};

const PostCard: React.FC<PostCardProps> = ({ posteo, onEdit }) => {
  const setPost = usePostStore((state) => state.setPosteo);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportComment, setReportComment] = useState("");
  const [reportType, setReportType] = useState<string>(
    "spam"
  );

  // const user_id = useAuthStore((state) => state.user_id);
  const user = useAuthStore((state) => state.user);
  const user_id = user && user.id !== null ? user.id : undefined;

  const { data, isLoading } = useQuery(
    ["user", user_id],
    () => fetchUserById(user_id!),
    {
      enabled: !!user_id,
      refetchOnWindowFocus: false,
    }
  );

  const deletePostMutation = useDeletePost();
  const reportPostMutation = useReportPost();

  const open = Boolean(anchorEl);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const handleSetPost = () => {
    setPost(posteo);
  };

  const handleEditPost = () => {
    onEdit(posteo);
  }
  
  const handleDeletePost = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este posteo?")) {
      deletePostMutation.mutate(posteo.id);
    }
  };
  
  const handleReportPost = () => {
    setOpenReportDialog(true);
  }

  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
    setReportComment("");
  };

  const handleSubmitReport = () => {
    // Prevenir auto-denuncia incluso si se intenta por medios indirectos
    if (user_id && posteo.usuario && user_id === posteo.usuario.id) {
      toast.error("No podés denunciar tu propio posteo");
      handleCloseReportDialog();
      return;
    }

    // Mapear el tipo de denuncia al formato esperado por el backend
    const mappedType = reportType.toLowerCase() === 'spam' 
      ? 'SPAM'
      : reportType.toLowerCase() === 'acoso'
      ? 'ACOSO'
      : 'CONTENIDO_INDEBIDO';

    reportPostMutation.mutate({
      tipo: mappedType,
      usuario_denunciado: null,
      posteo_denunciado: posteo.id,
      evento_denunciado: null,
      comentario: reportComment,
    });
    handleCloseReportDialog();
  };

  const menuActions = useMenuActions({
    userId: user_id,
    ownerId: posteo.usuario.id,
    onEdit: handleEditPost,
    onDelete: handleDeletePost,
    onReport: handleReportPost,
    posteo: posteo,
    enabled: !isLoading && !!user_id, // Solo habilitado cuando tengamos user_id y no esté cargando
  });

  const isSubmitDisabled = !reportType || reportComment.trim().length < 10;

  return (
    <>
      <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl m-2 font-bold text-gray-900 dark:text-gray-200">
            {posteo.titulo}
          </CardTitle>
          <VerticalMenu actions={menuActions} />
        </div>
        <Link
          href={`/dashboard/post/${posteo.id}`}
          className="block"
          onClick={handleSetPost}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {truncateDescription(posteo.descripcion, 150)}
                </p>
              </div>
              {posteo.imagen && (
                <div className="w-1/3 h-auto relative aspect-square">
                  <Image
                    src={posteo.imagen}
                    alt="Imagen del posteo"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md content-end"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              {posteo.tipo_posteo && posteo.tipo_posteo.tipo && (
                <Badge variant="secondary">
                  {/* {getPosteoType()} */}
                  {posteo.tipo_posteo.tipo}
                </Badge>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {posteo.fecha_creacion_legible}
                </p>
                {posteo.usuario &&
                  posteo.usuario.piso !== null &&
                  posteo.usuario.numero !== null && (
                    <p className="text-sm text-gray-700 mb-0 dark:text-gray-300">
                      Piso {posteo.usuario.piso} - {posteo.usuario.numero}
                    </p>
                  )}
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
      
      {/* Diálogo mejorado */}
      <Dialog
        open={openReportDialog}
        onClose={handleCloseReportDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "dark:bg-gray-900 rounded-lg",
          component: motion.div,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
          transition: { duration: 0.3 }
        }}
        aria-labelledby="report-dialog-title"
      >
        <DialogTitle 
          id="report-dialog-title" 
          className="dark:text-gray-100 flex items-center justify-between border-b dark:border-gray-700 pb-2"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <FlagIcon color="error" />
            <Typography variant="h6">Denunciar Posteo</Typography>
          </Box>
          <IconButton
            aria-label="cerrar"
            onClick={handleCloseReportDialog}
            className="dark:text-gray-400 dark:hover:text-gray-200"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent className="mt-4">
          <Typography variant="body2" className="dark:text-gray-300 mb-4">
            Por favor proporciona detalles sobre por qué estás denunciando este contenido. 
            Todas las denuncias son revisadas por nuestro equipo.
          </Typography>
          
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="report-type-label" className="dark:text-gray-300">
              Tipo de denuncia
            </InputLabel>
            <Select
              labelId="report-type-label"
              id="report-type"
              value={reportType}
              label="Tipo de denuncia"
              onChange={handleReportTypeChange}
              className="dark:text-gray-200"
              MenuProps={{
                PaperProps: {
                  className: "dark:bg-gray-800"
                }
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            >
              <MenuItem
                value="spam"
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Spam
              </MenuItem>
              <MenuItem
                value="acoso"
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Acoso
              </MenuItem>
              <MenuItem
                value="contenido indebido"
                className="dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Contenido indebido
              </MenuItem>
            </Select>
            <FormHelperText className="dark:text-gray-400">
              Seleccione el tipo de denuncia
            </FormHelperText>
          </FormControl>
          
          <TextField
            margin="dense"
            id="reportComment"
            label="Motivo de la denuncia"
            placeholder="Describe en detalle por qué este contenido debe ser revisado..."
            type="text"
            fullWidth
            variant="outlined"
            value={reportComment}
            onChange={(e) => setReportComment(e.target.value)}
            multiline
            rows={4}
            className="mt-3"
            inputProps={{ maxLength: 500 }}
            helperText={`${reportComment.length}/500 caracteres`}
            FormHelperTextProps={{ className: "dark:text-gray-400 flex justify-end" }}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          />
        </DialogContent>
        
        <DialogActions className="px-6 py-3 border-t dark:border-gray-700">
          <Button
            onClick={handleCloseReportDialog}
            variant="outline"
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitReport}
            variant="default"
            disabled={isSubmitDisabled}
            className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 disabled:dark:bg-gray-700 disabled:dark:text-gray-400"
          >
            Enviar denuncia
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCard;