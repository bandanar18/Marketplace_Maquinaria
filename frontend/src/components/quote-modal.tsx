"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { quotesService } from "@/services/products.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/context/auth-context";
import { AlertCircle, LogIn } from "lucide-react";
import Link from "next/link";

const quoteSchema = z.object({
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  quantity: z.number().min(1, "La cantidad mínima es 1"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  projectLocation: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteModalProps {
  product: { id: string; title: string; transactionType?: string; pricePerDay?: number; pricePerWeek?: number; pricePerMonth?: number; minRentalDays?: number; depositAmount?: number };
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ product, isOpen, onClose }: QuoteModalProps) {
  const { user } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const isRental = product.transactionType === 'RENTAL' || product.transactionType === 'BOTH';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { quantity: 1, startDate: undefined, endDate: undefined, projectLocation: "" },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const calculateRentalDays = () => {
    if (startDate && endDate) {
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      const quoteData: any = {
        productId: product.id,
        message: data.message,
        quantity: data.quantity,
      };
      
      if (isRental && data.startDate && data.endDate) {
        quoteData.startDate = data.startDate.toISOString();
        quoteData.endDate = data.endDate.toISOString();
      }
      
      await quotesService.createQuote(quoteData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onClose();
      }, 3000);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setIsAuthError(true);
        setError("Debes iniciar sesión para realizar esta acción.");
      } else {
        setError(err.response?.data?.message || "Error al enviar la cotización.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-primary/95 border-none shadow-2xl">
        {isSuccess ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-2xl font-barlow font-bold">SOLICITUD ENVIADA</h3>
            <p className="text-steel mt-2">El vendedor ha sido notificado y te responderá pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-barlow font-bold">SOLICITAR COTIZACIÓN</DialogTitle>
              <DialogDescription>
                Estás solicitando información para: <span className="font-semibold text-primary">{product.title}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              {error && (
                <div className={`p-4 border rounded-xl flex items-start gap-3 ${isAuthError ? 'bg-accent/10 border-accent/20' : 'bg-danger/10 border-danger/20'}`}>
                  {isAuthError ? <AlertCircle className="w-5 h-5 text-accent shrink-0" /> : <AlertCircle className="w-5 h-5 text-danger shrink-0" />}
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isAuthError ? 'text-primary' : 'text-danger'}`}>{error}</p>
                    {isAuthError && (
                      <Link 
                        href="/auth/login" 
                        className="inline-flex items-center mt-2 text-xs font-bold text-accent hover:underline"
                      >
                        <LogIn className="w-3 h-3 mr-1" /> IR A INICIAR SESIÓN
                      </Link>
                    )}
                  </div>
                </div>
              )}
              
              {isRental && (
                <>
                  <div className="grid gap-3">
                    <Label className="font-bold">Fechas de Renta</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: es }) : "Fecha inicio"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => setValue("startDate", date)}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "dd/MM/yyyy", { locale: es }) : "Fecha fin"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => setValue("endDate", date)}
                            initialFocus
                            locale={es}
                            disabled={(date) => startDate ? date < startDate : false}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {calculateRentalDays() > 0 && (
                      <p className="text-sm text-steel">Días seleccionados: <strong>{calculateRentalDays()} días</strong></p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="projectLocation">Lugar de uso de la maquinaria (proyecto)</Label>
                    <Input
                      id="projectLocation"
                      placeholder="Ciudad o ubicación del proyecto..."
                      {...register("projectLocation")}
                    />
                  </div>

                  {product.depositAmount && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
                      <p className="text-sm font-bold text-primary">Depósito de garantía: ${product.depositAmount?.toLocaleString()}</p>
                      <p className="text-xs text-steel mt-1">Será requerido al confirmar la renta</p>
                    </div>
                  )}
                </>
              )}

              {!isRental && (
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Cantidad de unidades</Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  {errors.quantity && <p className="text-xs text-danger">{errors.quantity.message}</p>}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="message">Mensaje para el vendedor</Label>
                <Textarea
                  id="message"
                  placeholder="Hola, me gustaría recibir más información sobre este equipo y conocer los plazos de entrega..."
                  className="h-32"
                  {...register("message")}
                />
                {errors.message && <p className="text-xs text-danger">{errors.message.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>CANCELAR</Button>
              <Button type="submit" className="bg-primary" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "ENVIAR SOLICITUD"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
