"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Address } from "@/types/database";

const addressSchema = z.object({
  label: z.string().min(1),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(6),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "Home" },
  });

  const loadAddresses = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setAddresses((data as Address[]) || []);
  };

  useEffect(() => { loadAddresses(); }, []);

  const onSubmit = async (data: AddressForm) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("addresses").insert({
      ...data,
      user_id: user.id,
      is_default: addresses.length === 0,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Address added");
      reset();
      setShowForm(false);
      loadAddresses();
    }
  };

  const deleteAddress = async (id: string) => {
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id);
    toast.success("Address deleted");
    loadAddresses();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Addresses</h1>
        <div className="flex gap-2">
          <Button variant="brand" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Address"}
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/account">Back</Link>
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Label</Label>
              <Input {...register("label")} placeholder="Home, Work..." />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input {...register("pincode")} />
              {errors.pincode && <p className="text-sm text-destructive">{errors.pincode.message}</p>}
            </div>
          </div>
          <div>
            <Label>Address Line 1</Label>
            <Input {...register("address_line1")} />
          </div>
          <div>
            <Label>Address Line 2</Label>
            <Input {...register("address_line2")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input {...register("city")} />
            </div>
            <div>
              <Label>State</Label>
              <Input {...register("state")} />
            </div>
          </div>
          <Button type="submit" variant="brand">Save Address</Button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border p-4 flex justify-between">
            <div>
              <p className="font-semibold">{addr.label} {addr.is_default && <span className="text-xs text-brand">(Default)</span>}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteAddress(addr.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <p className="text-center text-muted-foreground py-8">No saved addresses</p>
        )}
      </div>
    </div>
  );
}
