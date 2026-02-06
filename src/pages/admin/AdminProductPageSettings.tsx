import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productPageSettingsService, ProductPageSettings, defaultProductPageSettings } from "@/services/productPageSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, RotateCcw, Tag, DollarSign, MapPin, Type, MousePointer } from "lucide-react";

const AdminProductPageSettings = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Omit<ProductPageSettings, 'id' | 'created_at' | 'updated_at'>>(defaultProductPageSettings);

    // Fetch current settings
    const { data: settings, isLoading } = useQuery({
        queryKey: ['product-page-settings'],
        queryFn: productPageSettingsService.getSettings,
    });

    // Update form when settings load
    useEffect(() => {
        if (settings) {
            setFormData({
                product_tag_label: settings.product_tag_label,
                pricing_note: settings.pricing_note,
                delivery_title: settings.delivery_title,
                pincode_placeholder: settings.pincode_placeholder,
                delivery_button_text: settings.delivery_button_text,
            });
        }
    }, [settings]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: (data: Partial<ProductPageSettings>) =>
            productPageSettingsService.updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-page-settings'] });
            toast.success('Settings saved successfully!');
        },
        onError: (error: Error) => {
            toast.error(`Failed to save: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleReset = () => {
        setFormData(defaultProductPageSettings);
        toast.info('Form reset to defaults');
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Product Page Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Customize text labels and messages shown on all product detail pages
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Tag Label */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Tag className="h-5 w-5 text-primary" />
                            Product Tag Label
                        </CardTitle>
                        <CardDescription>
                            The category tag shown above the product title
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            value={formData.product_tag_label}
                            onChange={(e) => handleChange('product_tag_label', e.target.value)}
                            placeholder="e.g., Furniture, Office Chair, Premium"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Preview: <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">{formData.product_tag_label}</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Pricing Note */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            Pricing Note
                        </CardTitle>
                        <CardDescription>
                            Additional note displayed below the product price
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={formData.pricing_note}
                            onChange={(e) => handleChange('pricing_note', e.target.value)}
                            placeholder="e.g., * GST and shipping charges extra..."
                            rows={2}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Preview: <span className="italic">{formData.pricing_note}</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Delivery Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            Delivery Check Section
                        </CardTitle>
                        <CardDescription>
                            Customize the delivery availability check UI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Section Title
                            </Label>
                            <Input
                                value={formData.delivery_title}
                                onChange={(e) => handleChange('delivery_title', e.target.value)}
                                placeholder="e.g., Check Delivery"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Pincode Input Placeholder
                            </Label>
                            <Input
                                value={formData.pincode_placeholder}
                                onChange={(e) => handleChange('pincode_placeholder', e.target.value)}
                                placeholder="e.g., Enter pincode"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <MousePointer className="h-4 w-4" />
                                Button Text
                            </Label>
                            <Input
                                value={formData.delivery_button_text}
                                onChange={(e) => handleChange('delivery_button_text', e.target.value)}
                                placeholder="e.g., Check"
                            />
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                            <div className="space-y-2">
                                <p className="font-medium">{formData.delivery_title}</p>
                                <div className="flex gap-2">
                                    <Input
                                        disabled
                                        placeholder={formData.pincode_placeholder}
                                        className="max-w-[200px]"
                                    />
                                    <Button type="button" variant="outline" disabled>
                                        {formData.delivery_button_text}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="min-w-[140px]"
                    >
                        {saveMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductPageSettings;
