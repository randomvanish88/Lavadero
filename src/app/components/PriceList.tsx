import { useState } from 'react';
import { Price } from '../App';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Pencil, Trash2, Search, Car, DollarSign } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface PriceListProps {
  prices: Price[];
  onEdit: (price: Price) => void;
  onDelete: (id: string) => void;
}

// Función para obtener color según el tamaño
const getSizeColor = (size: string) => {
  const colors: Record<string, string> = {
    'Pequeño': 'bg-green-100 text-green-700 border-green-300',
    'Mediano': 'bg-blue-100 text-blue-700 border-blue-300',
    'Grande': 'bg-orange-100 text-orange-700 border-orange-300',
    'SUV': 'bg-purple-100 text-purple-700 border-purple-300',
    'Camioneta': 'bg-red-100 text-red-700 border-red-300',
    'Van': 'bg-pink-100 text-pink-700 border-pink-300',
  };
  return colors[size] || 'bg-gray-100 text-gray-700 border-gray-300';
};

export function PriceList({ prices, onEdit, onDelete }: PriceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');

  // Obtener marcas y tamaños únicos
  const uniqueBrands = Array.from(new Set(prices.map(p => p.brand))).sort();
  const uniqueSizes = Array.from(new Set(prices.map(p => p.size))).sort();

  // Filtrar precios
  const filteredPrices = prices.filter(price => {
    const matchesSearch = 
      price.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.size.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSize = filterSize === 'all' || price.size === filterSize;
    const matchesBrand = filterBrand === 'all' || price.brand === filterBrand;

    return matchesSearch && matchesSize && matchesBrand;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por marca, servicio o tamaño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-purple-200 focus:border-purple-400"
          />
        </div>

        {/* Filtro por Marca */}
        <Select value={filterBrand} onValueChange={setFilterBrand}>
          <SelectTrigger className="w-full md:w-48 border-blue-200 focus:border-blue-400">
            <SelectValue placeholder="Filtrar por marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {uniqueBrands.map(brand => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por Tamaño */}
        <Select value={filterSize} onValueChange={setFilterSize}>
          <SelectTrigger className="w-full md:w-48 border-pink-200 focus:border-pink-400">
            <SelectValue placeholder="Filtrar por tamaño" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tamaños</SelectItem>
            {uniqueSizes.map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de precios */}
      <div className="rounded-lg border border-purple-200 overflow-hidden shadow-md">
        <Table>
          <TableHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="text-white">Marca</TableHead>
              <TableHead className="text-white">Tamaño</TableHead>
              <TableHead className="text-white">Servicio</TableHead>
              <TableHead className="text-right text-white">Precio</TableHead>
              <TableHead className="text-right text-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No se encontraron precios
                </TableCell>
              </TableRow>
            ) : (
              filteredPrices.map((price, index) => (
                <TableRow 
                  key={price.id}
                  className={index % 2 === 0 ? 'bg-purple-50/30' : 'bg-white'}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-500" />
                      {price.brand}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSizeColor(price.size)}>
                      {price.size}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{price.service}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700">{price.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(price)}
                        className="hover:bg-blue-100 hover:text-blue-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente el precio de{' '}
                              <strong>{price.service}</strong> para{' '}
                              <strong>{price.brand} ({price.size})</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(price.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-4 shadow-lg">
          <div className="text-sm opacity-90">Total de Precios</div>
          <div className="text-3xl font-bold">
            {filteredPrices.length} <span className="text-base font-normal">de {prices.length}</span>
          </div>
        </div>
        {filteredPrices.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4 shadow-lg">
            <div className="text-sm opacity-90">Precio Promedio</div>
            <div className="text-3xl font-bold">
              ${(filteredPrices.reduce((sum, p) => sum + p.price, 0) / filteredPrices.length).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}