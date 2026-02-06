import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, PenTool, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cmsService, Location } from "@/services/cms";

const AdminLocations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    const [formData, setFormData] = useState({
        city: "",
        state: "Gujarat"
    });
    const [saving, setSaving] = useState(false);

    const fetchLocations = async () => {
        setLoading(true);
        const { data, error } = await cmsService.getLocations();
        if (error) toast.error("Failed to load locations");
        else setLocations(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleOpen = (loc?: Location) => {
        if (loc) {
            setEditingLocation(loc);
            setFormData({ city: loc.city, state: loc.state });
        } else {
            setEditingLocation(null);
            setFormData({ city: "", state: "Gujarat" });
        }
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingLocation) {
                await cmsService.updateLocation(editingLocation.id, formData);
                toast.success("Location updated");
            } else {
                await cmsService.createLocation(formData);
                toast.success("Location created");
            }
            setIsOpen(false);
            fetchLocations();
        } catch (error: any) {
            toast.error("Failed to save location");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this location?")) return;
        try {
            await cmsService.deleteLocation(id);
            toast.success("Location deleted");
            fetchLocations();
        } catch (error) { toast.error("Failed to delete"); }
    };

    // Bulk Add Logic
    const [isBulkOpen, setIsBulkOpen] = useState(false);
    const [bulkText, setBulkText] = useState("");
    const [bulkSaving, setBulkSaving] = useState(false);

    const handleBulkSave = async () => {
        if (!bulkText.trim()) return;
        setBulkSaving(true);
        try {
            const cities = bulkText.split("\n")
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (cities.length === 0) {
                toast.error("No valid cities found");
                setBulkSaving(false);
                return;
            }

            const locationsToCreate = cities.map(city => ({
                city,
                state: "Gujarat" // Default as per requirement
            }));

            const { error, data } = await cmsService.createLocationsBulk(locationsToCreate);

            if (error) throw error;

            toast.success(`Processed ${cities.length} cities. Duplicates were automatically skipped.`);
            setBulkText("");
            setIsBulkOpen(false);
            fetchLocations();
        } catch (error) {
            console.error(error);
            toast.error("Failed to bulk add locations");
        } finally {
            setBulkSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Locations</h1>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsBulkOpen(true)}><Plus className="mr-2 h-4 w-4" /> Bulk Add</Button>
                    <Button onClick={() => handleOpen()}><Plus className="mr-2 h-4 w-4" /> Add Location</Button>
                </div>
            </div>

            {loading ? <Loader2 className="animate-spin" /> : (
                <div className="bg-white rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>City</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.map((loc) => (
                                <TableRow key={loc.id}>
                                    <TableCell className="font-medium">{loc.city}</TableCell>
                                    <TableCell>{loc.state}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(loc)}><PenTool className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(loc.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Single Add/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingLocation ? "Edit" : "Add"} Location</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>City Name</Label>
                            <Input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Input value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} required />
                        </div>
                        <Button type="submit" disabled={saving} className="w-full">
                            {saving && <Loader2 className="animate-spin mr-2" />} Save
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Bulk Add Dialog */}
            <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader><DialogTitle>Bulk Add Locations</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Enter Cities (One per line)</Label>
                            <Textarea
                                value={bulkText}
                                onChange={e => setBulkText(e.target.value)}
                                placeholder={`Example:\nAhmedabad\nSurat\nVadodara`}
                                className="h-64"
                            />
                            <p className="text-sm text-muted-foreground">Duplicates will be automatically skipped.</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsBulkOpen(false)}>Cancel</Button>
                            <Button onClick={handleBulkSave} disabled={bulkSaving}>
                                {bulkSaving && <Loader2 className="animate-spin mr-2" />} Save Bulk Locations
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLocations;
