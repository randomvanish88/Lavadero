import { useEffect, useState } from 'react';
import { Price } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Save, X, Car, Ruler, Sparkles, DollarSign } from 'lucide-react';

interface PriceFormProps {
  onSubmit: (price: Omit<Price, 'id'> | Price) => void;
  onCancel?: () => void;
  editingPrice?: Price | null;
  sizes: string[];
  brands: string[];
}

const SERVICES = [
  'Lavado Básico',
  'Lavado Premium',
  'Lavado Completo',
  'Lavado + Aspirado',
  'Lavado + Encerado',
  'Lavado Premium + Encerado',
  'Detallado Interior',
  'Detallado Exterior',
  'Detallado Completo',
  'Pulido',
  'Limpieza de Motor'
];

export function PriceForm({ onSubmit, onCancel, editingPrice, sizes, brands }: PriceFormProps) {
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [size, setSize] = useState('');
  const [service, setService] = useState('');
  const [customService, setCustomService] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (editingPrice) {
      setBrand(brands.includes(editingPrice.brand) ? editingPrice.brand : 'Otro');
      setCustomBrand(brands.includes(editingPrice.brand) ? '' : editingPrice.brand);
      setSize(editingPrice.size);
      setService(SERVICES.includes(editingPrice.service) ? editingPrice.service : 'Otro');
      setCustomService(SERVICES.includes(editingPrice.service) ? '' : editingPrice.service);
      setPrice(editingPrice.price.toString());
    } else {
      resetForm();
    }
  }, [editingPrice, brands]);

  const resetForm = () => {
    setBrand('');
    setCustomBrand('');
    setSize('');
    setService('');
    setCustomService('');
    setPrice('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalBrand = brand === 'Otro' ? customBrand : brand;
    const finalService = service === 'Otro' ? customService : service;

    if (!finalBrand || !size || !finalService || !price) {
      return;
    }

    const priceData = {
      brand: finalBrand,
      size,
      service: finalService,
      price: parseFloat(price),
    };

    if (editingPrice) {
      onSubmit({ ...priceData, id: editingPrice.id });
    } else {
      onSubmit(priceData);
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {editingPrice ? 'Editar Precio' : 'Agregar Nuevo Precio'}
        </h2>
        <p className="text-gray-600">
          Complete los datos del servicio y su precio correspondiente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Marca */}
        <div className="space-y-2 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <Label htmlFor="brand" className="flex items-center gap-2 text-blue-700">
            <Car className="w-4 h-4" />
            Marca del Vehículo
          </Label>
          <Select value={brand} onValueChange={setBrand} required>
            <SelectTrigger id="brand" className="bg-white border-blue-300">
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {brand === 'Otro' && (
            <Input
              type="text"
              placeholder="Especificar marca"
              value={customBrand}
              onChange={(e) => setCustomBrand(e.target.value)}
              required
              className="bg-white"
            />
          )}
        </div>

        {/* Tamaño */}
        <div className="space-y-2 bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <Label htmlFor="size" className="flex items-center gap-2 text-purple-700">
            <Ruler className="w-4 h-4" />
            Tamaño del Vehículo
          </Label>
          <Select value={size} onValueChange={setSize} required>
            <SelectTrigger id="size" className="bg-white border-purple-300">
              <SelectValue placeholder="Seleccionar tamaño" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Servicio */}
        <div className="space-y-2 bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
          <Label htmlFor="service" className="flex items-center gap-2 text-pink-700">
            <Sparkles className="w-4 h-4" />
            Tipo de Servicio
          </Label>
          <Select value={service} onValueChange={setService} required>
            <SelectTrigger id="service" className="bg-white border-pink-300">
              <SelectValue placeholder="Seleccionar servicio" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          {service === 'Otro' && (
            <Input
              type="text"
              placeholder="Especificar servicio"
              value={customService}
              onChange={(e) => setCustomService(e.target.value)}
              required
              className="bg-white"
            />
          )}
        </div>

        {/* Precio */}
        <div className="space-y-2 bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <Label htmlFor="price" className="flex items-center gap-2 text-green-700">
            <DollarSign className="w-4 h-4" />
            Precio ($)
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="bg-white border-green-300"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="border-2">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        )}
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        >
          {editingPrice ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Actualizar Precio
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Precio
            </>
          )}
        </Button>
      </div>
    </form>
  );
}