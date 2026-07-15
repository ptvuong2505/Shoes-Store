import { accountApi } from "@/features/account/api/account.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  addressSchema,
  type AddressFormValues,
} from "@/features/account/schemas/account.schemas";
import { Loader2, MapPin, Phone, Plus, Star, Trash2 } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

function AddressesPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: accountApi.getAddresses,
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: "",
      phone: "",
      addressLine: "",
      city: "",
      isPrimary: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: AddressFormValues) => accountApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      form.reset();
      setShowForm(false);
    },
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (id: string) => accountApi.setPrimary(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountApi.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium transition-colors duration-150 hover:bg-accent"
          >
            <Plus className="size-4" />
            Add Address
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form
          noValidate
          onSubmit={form.handleSubmit((values) =>
            createMutation.mutate(values),
          )}
          className="rounded-xl border border-border/60 bg-card p-6"
        >
          <h2 className="mb-4 text-base font-semibold">New Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Receiver Name"
              placeholder="Full name"
              error={form.formState.errors.receiverName?.message}
              {...form.register("receiverName")}
            />
            <FormField
              label="Phone"
              placeholder="Phone number"
              type="tel"
              error={form.formState.errors.phone?.message}
              {...form.register("phone")}
            />
            <FormField
              label="Address Line"
              placeholder="Street address"
              className="sm:col-span-2"
              error={form.formState.errors.addressLine?.message}
              {...form.register("addressLine")}
            />
            <FormField
              label="City"
              placeholder="City"
              error={form.formState.errors.city?.message}
              {...form.register("city")}
            />
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register("isPrimary")}
                  className="size-4 rounded border-border accent-foreground"
                />
                Set as primary
              </label>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all duration-150 hover:bg-foreground/90 disabled:opacity-50 active:scale-[0.98]"
            >
              {createMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save Address
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                form.reset();
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16">
          <MapPin className="size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No addresses yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Add your first address to speed up checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative rounded-xl border p-5 transition-colors duration-150 ${
                address.isPrimary
                  ? "border-foreground/20 bg-foreground/2"
                  : "border-border/60 bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold">
                  {address.receiverName}
                </h3>
                {address.isPrimary ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background">
                    <Star className="size-3" />
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => setPrimaryMutation.mutate(address.id)}
                    className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:border-foreground/30 hover:text-foreground"
                  >
                    Set default
                  </button>
                )}
              </div>
              <div className="mt-2.5 space-y-1">
                <p className="text-sm text-muted-foreground">
                  {address.addressLine}, {address.city}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                  <Phone className="size-3" />
                  {address.phone}
                </p>
              </div>
              <button
                onClick={() => handleDelete(address.id)}
                className="absolute bottom-4 right-4 rounded-md p-1.5 text-muted-foreground/40 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                aria-label="Delete address"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[13px] font-medium text-foreground/80">
        {label}
      </label>
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/10"
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  ),
);
FormField.displayName = "FormField";

export default AddressesPage;
