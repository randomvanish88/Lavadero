import { useState, useEffect } from 'react';
import { PriceList } from './components/PriceList';
import { PriceForm } from './components/PriceForm';
import { SizeEditor } from './components/SizeEditor';
import { BrandEditor } from './components/BrandEditor';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import logoImage from "../assets/logo.png";

export interface Price {
  id: string;
  brand: string;
  size: string;
  service: string;
  price: number;
}

const DEFAULT_SIZES = ['Pequeño', 'Mediano', 'Grande', 'SUV', 'Camioneta', 'Van'];
const DEFAULT_BRANDS = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Volkswagen', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi'];

function App() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('list');

  // Cargar datos desde localStorage
  useEffect(() => {
    const savedPrices = localStorage.getItem('carwash-prices');
    const savedSizes = localStorage.getItem('carwash-sizes');
    const savedBrands = localStorage.getItem('carwash-brands');

    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    } else {
      // Datos de ejemplo iniciales
      const defaultPrices: Price[] = [
        { id: '1', brand: 'Toyota', size: 'Pequeño', service: 'Lavado Básico', price: 15 },
        { id: '2', brand: 'Toyota', size: 'Mediano', service: 'Lavado Básico', price: 20 },
        { id: '3', brand: 'Toyota', size: 'Grande', service: 'Lavado Básico', price: 25 },
        { id: '4', brand: 'Honda', size: 'Pequeño', service: 'Lavado Premium', price: 25 },
        { id: '5', brand: 'Ford', size: 'SUV', service: 'Lavado Premium + Encerado', price: 50 },
      ];
      setPrices(defaultPrices);
      localStorage.setItem('carwash-prices', JSON.stringify(defaultPrices));
    }

    if (savedSizes) {
      setSizes(JSON.parse(savedSizes));
    } else {
      setSizes(DEFAULT_SIZES);
      localStorage.setItem('carwash-sizes', JSON.stringify(DEFAULT_SIZES));
    }

    if (savedBrands) {
      setBrands(JSON.parse(savedBrands));
    } else {
      setBrands(DEFAULT_BRANDS);
      localStorage.setItem('carwash-brands', JSON.stringify(DEFAULT_BRANDS));
    }
  }, []);

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    if (prices.length > 0) {
      localStorage.setItem('carwash-prices', JSON.stringify(prices));
    }
  }, [prices]);

  useEffect(() => {
    if (sizes.length > 0) {
      localStorage.setItem('carwash-sizes', JSON.stringify(sizes));
    }
  }, [sizes]);

  useEffect(() => {
    if (brands.length > 0) {
      localStorage.setItem('carwash-brands', JSON.stringify(brands));
    }
  }, [brands]);

  const handleAddPrice = (price: Omit<Price, 'id'>) => {
    const newPrice: Price = {
      ...price,
      id: Date.now().toString(),
    };
    setPrices([...prices, newPrice]);
  };

  const handleUpdatePrice = (updatedPrice: Price) => {
    setPrices(prices.map(p => p.id === updatedPrice.id ? updatedPrice : p));
    setEditingPrice(null);
  };

  const handleDeletePrice = (id: string) => {
    setPrices(prices.filter(p => p.id !== id));
  };

  const handleEditPrice = (price: Price) => {
    setEditingPrice(price);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingPrice(null);
  };

  // Handlers para tamaños
  const handleAddSize = (size: string) => {
    setSizes([...sizes, size]);
  };

  const handleEditSize = (oldSize: string, newSize: string) => {
    setSizes(sizes.map(s => s === oldSize ? newSize : s));
  };

  const handleDeleteSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };

  // Handlers para marcas
  const handleAddBrand = (brand: string) => {
    setBrands([...brands, brand]);
  };

  const handleEditBrand = (oldBrand: string, newBrand: string) => {
    setBrands(brands.map(b => b === oldBrand ? newBrand : b));
  };

  const handleDeleteBrand = (brand: string) => {
    setBrands(brands.filter(b => b !== brand));
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* NUEVO HEADER: Fuera del contenedor limitado para ocupar todo el ancho */}
      <div className="w-full mb-8 shadow-2xl overflow-hidden">
        <img 
          src={logoImage} 
          className="w-full h-auto block object-cover" 
          alt="GoWash Logo" 
        />
      </div>

      {/* CONTENIDO PRINCIPAL: Se mantiene centrado y con márgenes */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-white shadow-lg">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="add">Precios</TabsTrigger>
            <TabsTrigger value="sizes">Tamaños</TabsTrigger>
            <TabsTrigger value="brands">Marcas</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <PriceList
                prices={prices}
                onEdit={handleEditPrice}
                onDelete={handleDeletePrice}
              />
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card className="p-6 max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <PriceForm
                onSubmit={editingPrice ? handleUpdatePrice : handleAddPrice}
                onCancel={editingPrice ? handleCancelEdit : undefined}
                editingPrice={editingPrice}
                sizes={sizes}
                brands={brands}
              />
            </Card>
          </TabsContent>

          <TabsContent value="sizes">
            <Card className="p-6 max-w-4xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <SizeEditor
                sizes={sizes}
                onAddSize={handleAddSize}
                onEditSize={handleEditSize}
                onDeleteSize={handleDeleteSize}
              />
            </Card>
          </TabsContent>

          <TabsContent value="brands">
            <Card className="p-6 max-w-5xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <BrandEditor
                brands={brands}
                onAddBrand={handleAddBrand}
                onEditBrand={handleEditBrand}
                onDeleteBrand={handleDeleteBrand}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;