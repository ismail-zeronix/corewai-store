import {
    api,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    PageContextValue,
    useUserSettings,
} from '@vendure/dashboard';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
    CREATE_ASSETS_FROM_SOURCE_URLS,
    CreateAssetsFromSourceUrlsResult,
    IMPORT_PRODUCT_FROM_URL,
    ImportProductFromUrlResult,
    ScrapedProductPreview,
} from './graphql.js';

type Status = 'idle' | 'fetching' | 'preview' | 'importing';

function extractErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    return 'Something went wrong';
}

export function ImportFromUrlButton({ context }: { context: PageContextValue }) {
    const { settings } = useUserSettings();
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<ScrapedProductPreview | null>(null);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const showingPreview = status === 'preview' || status === 'importing';

    // Only offer this on the "create" flow: once a product exists, blindly
    // overwriting its name/description/images from a re-scrape is more likely
    // to surprise someone than help them.
    if (context.entity) {
        return null;
    }

    const reset = () => {
        setUrl('');
        setStatus('idle');
        setError(null);
        setPreview(null);
        setSelectedImages(new Set());
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) reset();
    };

    const handleFetch = async () => {
        if (!url.trim()) return;
        setStatus('fetching');
        setError(null);
        try {
            const result = (await api.mutate(IMPORT_PRODUCT_FROM_URL, {
                url: url.trim(),
            })) as ImportProductFromUrlResult;
            const scraped = result.importProductFromUrl;
            setPreview(scraped);
            setSelectedImages(new Set(scraped.images));
            setStatus('preview');
        } catch (err) {
            setError(extractErrorMessage(err));
            setStatus('idle');
        }
    };

    const toggleImage = (imageUrl: string) => {
        setSelectedImages(prev => {
            const next = new Set(prev);
            if (next.has(imageUrl)) next.delete(imageUrl);
            else next.add(imageUrl);
            return next;
        });
    };

    const handleInsert = async () => {
        if (!preview) return;
        const { form } = context;
        setStatus('importing');
        try {
            let createdAssetIds: string[] = [];
            if (selectedImages.size > 0) {
                const result = (await api.mutate(CREATE_ASSETS_FROM_SOURCE_URLS, {
                    urls: Array.from(selectedImages),
                })) as CreateAssetsFromSourceUrlsResult;
                createdAssetIds = result.createAssetsFromSourceUrls.map(a => a.id);
            }

            if (form) {
                const translations: Array<{ languageCode: string }> = form.getValues('translations') ?? [];
                const matchedIndex = translations.findIndex(
                    t => t?.languageCode === settings.contentLanguage,
                );
                const index = matchedIndex === -1 ? 0 : matchedIndex;

                if (preview.title) {
                    form.setValue(`translations.${index}.name`, preview.title, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }
                if (preview.description) {
                    form.setValue(`translations.${index}.description`, preview.description, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }
                if (createdAssetIds.length > 0) {
                    const existingAssetIds: string[] = form.getValues('assetIds') ?? [];
                    form.setValue('assetIds', [...existingAssetIds, ...createdAssetIds], {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                    if (!form.getValues('featuredAssetId')) {
                        form.setValue('featuredAssetId', createdAssetIds[0], {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }
                }
            }

            const priceNote =
                preview.price != null
                    ? ` A price of ${preview.price} ${preview.currencyCode ?? ''} was found on the source page — set it on the variant after creating this product.`
                    : '';
            toast.success('Imported product details from URL', {
                description: `Filled in name, description and ${createdAssetIds.length} image(s).${priceNote}`,
            });
            handleOpenChange(false);
        } catch (err) {
            setError(extractErrorMessage(err));
            setStatus('preview');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Import from URL
            </Button>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Import product from URL</DialogTitle>
                    <DialogDescription>
                        Paste the URL of a product page. We'll pull its title, description and gallery
                        images so you can review them before adding them to this product.
                    </DialogDescription>
                </DialogHeader>

                {!showingPreview && (
                    <div className="space-y-3">
                        <Label htmlFor="import-url">Product page URL</Label>
                        <Input
                            id="import-url"
                            placeholder="https://example.com/products/some-item"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            disabled={status === 'fetching'}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )}

                {showingPreview && preview && (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        <div>
                            <Label>Title</Label>
                            <p className="text-sm">{preview.title ?? '(none found)'}</p>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <p className="text-sm text-muted-foreground line-clamp-4">
                                {preview.description ?? '(none found)'}
                            </p>
                        </div>
                        {preview.price != null && (
                            <div>
                                <Label>Price found on page</Label>
                                <p className="text-sm text-muted-foreground">
                                    {preview.price} {preview.currencyCode ?? ''} — you'll need to set this
                                    on the product variant separately.
                                </p>
                            </div>
                        )}
                        <div>
                            <Label>
                                Images ({selectedImages.size}/{preview.images.length} selected)
                            </Label>
                            {preview.images.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No images found on that page.</p>
                            ) : (
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {preview.images.map(imageUrl => (
                                        <label
                                            key={imageUrl}
                                            className="relative cursor-pointer rounded border border-border overflow-hidden aspect-square"
                                        >
                                            <img
                                                src={imageUrl}
                                                alt=""
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                            <Checkbox
                                                checked={selectedImages.has(imageUrl)}
                                                onCheckedChange={() => toggleImage(imageUrl)}
                                                className="absolute top-1 right-1 bg-background"
                                            />
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )}

                <DialogFooter>
                    {!showingPreview ? (
                        <Button type="button" onClick={handleFetch} disabled={status === 'fetching' || !url.trim()}>
                            {status === 'fetching' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Fetch preview
                        </Button>
                    ) : (
                        <>
                            <Button type="button" variant="outline" onClick={() => setStatus('idle')}>
                                Back
                            </Button>
                            <Button type="button" onClick={handleInsert} disabled={status === 'importing'}>
                                {status === 'importing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Insert into form
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
