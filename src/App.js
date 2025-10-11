import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, 
  PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// COLOR SCHEME - 7 vibrant colors
const COLORS = {
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  success: '#8B5CF6',
  danger: '#EF4444',
  info: '#06B6D4',
  warning: '#F97316',
};

const CHART_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#F97316'];

// OpenWeatherMap API Key - Get free key from https://openweathermap.org/api
const WEATHER_API_KEY = '5b1b1fcc54acdaf2ba58079f9c437eb8'; // Replace with your actual key
// 25 CROPS DATABASE
const CROPS_DB = {
  rice: {
    id: 'rice', name: 'Rice', emoji: '🌾', season: 'Kharif', duration: '120-150d',
    N: 80, P: 40, K: 40, temp: 25, hum: 80, ph: 6.5, rain: 1200,
    price: '₹2,500/q', yield: '45q/ac', cost: '₹40,000', revenue: '₹1,12,500', profit: '₹72,500',
    desc: 'Rice is the staple food crop feeding half the world. Thrives in warm, humid climates with flooded fields. High-yielding varieties produce 40-50 quintals per acre. Requires careful water and nitrogen management across growth stages.',
    images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop'],
    cultivation: 'Prepare puddled field → Transplant 21-day seedlings at 20×15cm → Maintain 2-3 inch water → Apply fertilizers in 3 splits → Harvest when 80% grains golden',
    fertilizers: 'Basal: DAP 50kg + MOP 17kg | Top-1 (21d): Urea 43kg | Top-2 (45d): Urea 43kg | Top-3 (65d): Urea 22kg',
    selling: 'FCI procurement centers (MSP ₹2,183/q) • Rice mills • State agencies • APMC mandis • Export markets',
    videos: [{ title: 'Rice Cultivation Guide', url: 'https://youtube.com/results?search_query=rice+cultivation+guide', views: '2.5M' }],
    markets: [
      {month: 'Jan', price: 2800, demand: 85}, {month: 'Feb', price: 2900, demand: 80},
      {month: 'Mar', price: 2750, demand: 75}, {month: 'Apr', price: 2600, demand: 70},
      {month: 'May', price: 2500, demand: 72}, {month: 'Jun', price: 2400, demand: 78},
      {month: 'Jul', price: 2300, demand: 85}, {month: 'Aug', price: 2350, demand: 88},
      {month: 'Sep', price: 2400, demand: 90}, {month: 'Oct', price: 2600, demand: 95},
      {month: 'Nov', price: 2800, demand: 92}, {month: 'Dec', price: 2900, demand: 88}
    ]
  },

  maize: {
    id: 'maize', name: 'Maize', emoji: '🌽', season: 'Kharif/Rabi', duration: '90-120d',
    N: 80, P: 40, K: 20, temp: 25, hum: 65, ph: 6.0, rain: 800,
    price: '₹2,100/q', yield: '35q/ac', cost: '₹28,000', revenue: '₹73,500', profit: '₹45,500',
    desc: 'Versatile C4 crop for food, feed, and industrial uses. Modern hybrids give excellent yields. Primary ingredient in poultry feed. Used for starch, corn oil, glucose, and biofuel production.',
    images: ['https://images.unsplash.com/photo-1605762234986-8b7b0c3c3ff3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=600&fit=crop'],
    cultivation: 'Make ridges 60cm apart → Dibble seeds 5-7cm deep → Irrigate at knee-high/flowering/grain filling → Harvest when grains hard',
    fertilizers: 'Basal: DAP 50kg + MOP 12kg | Top-1 (30d): Urea 65kg | Top-2 (50d): Urea 43kg',
    selling: 'Poultry feed manufacturers • Starch industries • Cattle feed mills • Corn flakes companies • APMC markets',
    videos: [{ title: 'Maize Hybrid Farming', url: 'https://youtube.com/results?search_query=maize+cultivation', views: '2.1M' }],
    markets: [
      {month: 'Jan', price: 2100, demand: 88}, {month: 'Feb', price: 2200, demand: 85},
      {month: 'Mar', price: 2300, demand: 82}, {month: 'Apr', price: 2400, demand: 78},
      {month: 'May', price: 2350, demand: 80}, {month: 'Jun', price: 2250, demand: 85},
      {month: 'Jul', price: 2150, demand: 88}, {month: 'Aug', price: 2050, demand: 90},
      {month: 'Sep', price: 1950, demand: 92}, {month: 'Oct', price: 1850, demand: 95},
      {month: 'Nov', price: 1900, demand: 93}, {month: 'Dec', price: 2000, demand: 90}
    ]
  },

  chickpea: {
    id: 'chickpea', name: 'Chickpea', emoji: '🫘', season: 'Rabi', duration: '100-120d',
    N: 20, P: 60, K: 40, temp: 22, hum: 50, ph: 7.0, rain: 400,
    price: '₹6,000/q', yield: '18q/ac', cost: '₹18,000', revenue: '₹1,08,000', profit: '₹90,000',
    desc: 'Important pulse crop and protein source. Nitrogen-fixing legume improving soil fertility. Deep taproot accesses moisture from deeper layers. Export demand for kabuli chickpea very high.',
    images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596097635034-a0e1f57e2f91?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 30×10cm → Treat seeds with Rhizobium → 1-2 light irrigations at pre-flowering and pod development',
    fertilizers: 'Basal: DAP 40kg + MOP 25kg + Rhizobium culture | Foliar: 2% DAP spray at flowering',
    selling: 'Dal mills • Government MSP procurement • APMC mandis • Export markets (Kabuli) • Wholesale pulse merchants',
    videos: [{ title: 'Chickpea Cultivation', url: 'https://youtube.com/results?search_query=chickpea+farming', views: '1.2M' }],
    markets: [
      {month: 'Jan', price: 5800, demand: 72}, {month: 'Feb', price: 6000, demand: 75},
      {month: 'Mar', price: 6200, demand: 78}, {month: 'Apr', price: 6400, demand: 85},
      {month: 'May', price: 6300, demand: 82}, {month: 'Jun', price: 6100, demand: 78},
      {month: 'Jul', price: 5900, demand: 75}, {month: 'Aug', price: 5800, demand: 73},
      {month: 'Sep', price: 5700, demand: 72}, {month: 'Oct', price: 5800, demand: 73},
      {month: 'Nov', price: 6000, demand: 76}, {month: 'Dec', price: 6100, demand: 78}
    ]
  },

  kidneybeans: {
    id: 'kidneybeans', name: 'Kidney Beans', emoji: '🫘', season: 'Kharif/Rabi', duration: '90-120d',
    N: 30, P: 50, K: 40, temp: 23, hum: 60, ph: 6.5, rain: 700,
    price: '₹8,000/q', yield: '12q/ac', cost: '₹20,000', revenue: '₹96,000', profit: '₹76,000',
    desc: 'High-value pulse crop rich in protein and fiber. Growing demand in domestic and export markets.',
    images: ['https://images.unsplash.com/photo-1599909533131-7b0e4ec8c162?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 45×10cm → Rhizobium treatment → Irrigate at flowering and pod development',
    fertilizers: 'Basal: DAP 30kg + MOP 20kg + Rhizobium | Top: Urea 20kg at flowering',
    selling: 'Dal mills • Export markets • Canned food industry • Retail markets',
    videos: [{ title: 'Kidney Beans Farming', url: 'https://youtube.com/results?search_query=kidney+beans+cultivation', views: '0.8M' }],
    markets: [
      {month: 'Jan', price: 7800, demand: 75}, {month: 'Feb', price: 8000, demand: 78},
      {month: 'Mar', price: 8200, demand: 80}, {month: 'Apr', price: 8500, demand: 85},
      {month: 'May', price: 8300, demand: 82}, {month: 'Jun', price: 8000, demand: 78},
      {month: 'Jul', price: 7800, demand: 76}, {month: 'Aug', price: 7700, demand: 74},
      {month: 'Sep', price: 7600, demand: 73}, {month: 'Oct', price: 7700, demand: 74},
      {month: 'Nov', price: 7900, demand: 77}, {month: 'Dec', price: 8000, demand: 78}
    ]
  },

  pigeonpeas: {
    id: 'pigeonpeas', name: 'Pigeon Pea', emoji: '🫘', season: 'Kharif', duration: '150-180d',
    N: 20, P: 50, K: 25, temp: 26, hum: 60, ph: 7.0, rain: 650,
    price: '₹6,500/q', yield: '12q/ac', cost: '₹18,000', revenue: '₹78,000', profit: '₹60,000',
    desc: 'Important pulse crop known as Arhar/Tur. Deep root system makes it drought tolerant. Excellent for intercropping.',
    images: ['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1615485290789-5a0ea1c5c5e5?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 90×20cm → Minimal irrigation → Intercrop with short duration crops → Harvest in 2-3 pickings',
    fertilizers: 'Basal: DAP 30kg + MOP 15kg + Rhizobium culture | No top dressing needed',
    selling: 'Dal mills • Government MSP procurement • APMC mandis • Wholesale pulse traders',
    videos: [{ title: 'Pigeon Pea Farming', url: 'https://youtube.com/results?search_query=pigeon+pea+cultivation', views: '1.0M' }],
    markets: [
      {month: 'Jan', price: 6200, demand: 82}, {month: 'Feb', price: 6300, demand: 84},
      {month: 'Mar', price: 6500, demand: 87}, {month: 'Apr', price: 6800, demand: 91},
      {month: 'May', price: 6700, demand: 89}, {month: 'Jun', price: 6500, demand: 86},
      {month: 'Jul', price: 6300, demand: 83}, {month: 'Aug', price: 6200, demand: 81},
      {month: 'Sep', price: 6100, demand: 80}, {month: 'Oct', price: 6200, demand: 81},
      {month: 'Nov', price: 6400, demand: 84}, {month: 'Dec', price: 6500, demand: 86}
    ]
  },
  mothbeans: {
    id: 'mothbeans', name: 'Moth Beans', emoji: '🫘', season: 'Kharif', duration: '75-90d',
    N: 20, P: 40, K: 20, temp: 28, hum: 55, ph: 7.0, rain: 450,
    price: '₹5,500/q', yield: '8q/ac', cost: '₹12,000', revenue: '₹44,000', profit: '₹32,000',
    desc: 'Drought-resistant pulse crop suitable for arid regions. Good source of protein.',
    images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1589927986089-35812388d1f8?w=800&h=600&fit=crop'],
    cultivation: 'Broadcast or line sowing → Minimal irrigation → Harvest when pods dry',
    fertilizers: 'Basal: DAP 20kg + Rhizobium | Minimal fertilizer requirements',
    selling: 'Local markets • Dal mills • Animal feed industry',
    videos: [{ title: 'Moth Beans Cultivation', url: 'https://youtube.com/results?search_query=moth+beans+farming', views: '0.5M' }],
    markets: [
      {month: 'Jan', price: 5300, demand: 70}, {month: 'Feb', price: 5400, demand: 72},
      {month: 'Mar', price: 5600, demand: 75}, {month: 'Apr', price: 5800, demand: 78},
      {month: 'May', price: 5700, demand: 76}, {month: 'Jun', price: 5500, demand: 73},
      {month: 'Jul', price: 5300, demand: 71}, {month: 'Aug', price: 5200, demand: 69},
      {month: 'Sep', price: 5100, demand: 68}, {month: 'Oct', price: 5200, demand: 69},
      {month: 'Nov', price: 5400, demand: 72}, {month: 'Dec', price: 5500, demand: 73}
    ]
  },

  mungbean: {
    id: 'mungbean', name: 'Green Gram', emoji: '🟢', season: 'Kharif/Rabi', duration: '60-70d',
    N: 20, P: 40, K: 20, temp: 28, hum: 65, ph: 7.0, rain: 600,
    price: '₹7,000/q', yield: '6q/ac', cost: '₹14,000', revenue: '₹42,000', profit: '₹28,000',
    desc: 'Short duration pulse known as Moong. Highly nutritious and easily digestible. Used for dal and sprouts.',
    images: ['https://images.unsplash.com/photo-1582515073490-39981397c445?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1605970851118-f4c825d3c6e1?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 30×10cm → Rhizobium inoculation → One light irrigation → Harvest in 2 pickings',
    fertilizers: 'Basal: DAP 25kg + MOP 12kg + Rhizobium culture | No top dressing needed',
    selling: 'Dal mills • Government MSP procurement • APMC mandis • Health food stores • Sprout manufacturers',
    videos: [{ title: 'Green Gram Farming', url: 'https://youtube.com/results?search_query=mung+bean+cultivation', views: '0.9M' }],
    markets: [
      {month: 'Jan', price: 6700, demand: 78}, {month: 'Feb', price: 6800, demand: 80},
      {month: 'Mar', price: 7000, demand: 83}, {month: 'Apr', price: 7300, demand: 87},
      {month: 'May', price: 7200, demand: 85}, {month: 'Jun', price: 7000, demand: 82},
      {month: 'Jul', price: 6800, demand: 79}, {month: 'Aug', price: 6700, demand: 77},
      {month: 'Sep', price: 6600, demand: 76}, {month: 'Oct', price: 6700, demand: 77},
      {month: 'Nov', price: 6900, demand: 80}, {month: 'Dec', price: 7000, demand: 82}
    ]
  },

  blackgram: {
    id: 'blackgram', name: 'Black Gram', emoji: '⚫', season: 'Kharif/Rabi', duration: '70-90d',
    N: 20, P: 40, K: 20, temp: 27, hum: 65, ph: 7.0, rain: 650,
    price: '₹7,500/q', yield: '8q/ac', cost: '₹16,000', revenue: '₹60,000', profit: '₹44,000',
    desc: 'Important pulse known as Urad. Short duration allows multiple crops. Used for dal and papad.',
    images: ['https://images.unsplash.com/photo-1599909533131-7b0e4ec8c162?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 30×10cm → Rhizobium inoculation → Light irrigation → Harvest when pods turn black',
    fertilizers: 'Basal: DAP 25kg + MOP 12kg + Rhizobium culture | Foliar: DAP spray at flowering',
    selling: 'Dal mills • Government MSP procurement • APMC mandis • Papad manufacturers',
    videos: [{ title: 'Black Gram Cultivation', url: 'https://youtube.com/results?search_query=black+gram+farming', views: '0.8M' }],
    markets: [
      {month: 'Jan', price: 7200, demand: 80}, {month: 'Feb', price: 7300, demand: 82},
      {month: 'Mar', price: 7500, demand: 85}, {month: 'Apr', price: 7800, demand: 89},
      {month: 'May', price: 7700, demand: 87}, {month: 'Jun', price: 7500, demand: 84},
      {month: 'Jul', price: 7300, demand: 81}, {month: 'Aug', price: 7200, demand: 79},
      {month: 'Sep', price: 7100, demand: 78}, {month: 'Oct', price: 7200, demand: 79},
      {month: 'Nov', price: 7400, demand: 82}, {month: 'Dec', price: 7500, demand: 84}
    ]
  },

  lentil: {
    id: 'lentil', name: 'Lentil', emoji: '🔴', season: 'Rabi', duration: '110-130d',
    N: 20, P: 50, K: 25, temp: 20, hum: 55, ph: 7.0, rain: 450,
    price: '₹5,800/q', yield: '10q/ac', cost: '₹16,000', revenue: '₹58,000', profit: '₹42,000',
    desc: 'Important pulse known as Masoor. Cool season crop. High protein content. Quick cooking dal.',
    images: ['https://images.unsplash.com/photo-1596097630910-23e0c2891b2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1615485290382-1f4e5c8e4a0b?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 30×10cm in November → Rhizobium seed treatment → 1-2 light irrigations',
    fertilizers: 'Basal: DAP 30kg + MOP 15kg + Rhizobium culture | Foliar: DAP spray if needed',
    selling: 'Dal mills • Government MSP procurement • APMC mandis • Wholesale pulse merchants',
    videos: [{ title: 'Lentil Cultivation', url: 'https://youtube.com/results?search_query=lentil+farming', views: '0.7M' }],
    markets: [
      {month: 'Jan', price: 5600, demand: 76}, {month: 'Feb', price: 5700, demand: 78},
      {month: 'Mar', price: 5900, demand: 81}, {month: 'Apr', price: 6100, demand: 85},
      {month: 'May', price: 6000, demand: 83}, {month: 'Jun', price: 5800, demand: 80},
      {month: 'Jul', price: 5600, demand: 77}, {month: 'Aug', price: 5500, demand: 75},
      {month: 'Sep', price: 5400, demand: 74}, {month: 'Oct', price: 5500, demand: 75},
      {month: 'Nov', price: 5700, demand: 78}, {month: 'Dec', price: 5800, demand: 80}
    ]
  },

  pomegranate: {
    id: 'pomegranate', name: 'Pomegranate', emoji: '🍎', season: 'Perennial', duration: '2-3y to bear',
    N: 100, P: 50, K: 100, temp: 25, hum: 55, ph: 7.0, rain: 600,
    price: '₹80/kg', yield: '80q/ac', cost: '₹1,80,000', revenue: '₹6,40,000', profit: '₹4,60,000',
    desc: 'High-value fruit crop with medicinal properties. Growing export demand. Rich in antioxidants. Drip irrigation mandatory.',
    images: ['https://images.unsplash.com/photo-1571575173700-afb9492d621a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1609160954812-86585ce3d719?w=800&h=600&fit=crop'],
    cultivation: 'Plant cuttings/grafts at 12×12ft → Drip irrigation → Bahar treatment for controlled flowering → IPM',
    fertilizers: 'Annual per plant: 250g N + 125g P + 250g K | Monthly fertigation | Calcium sprays for quality',
    selling: 'Export markets (Europe, Middle East) • Premium fruit markets • Juice manufacturers • Retail supermarkets',
    videos: [{ title: 'Pomegranate Farming', url: 'https://youtube.com/results?search_query=pomegranate+cultivation', views: '1.6M' }],
    markets: [
      {month: 'Jan', price: 75, demand: 85}, {month: 'Feb', price: 78, demand: 87},
      {month: 'Mar', price: 82, demand: 90}, {month: 'Apr', price: 85, demand: 92},
      {month: 'May', price: 83, demand: 91}, {month: 'Jun', price: 80, demand: 88},
      {month: 'Jul', price: 77, demand: 86}, {month: 'Aug', price: 75, demand: 84},
      {month: 'Sep', price: 76, demand: 85}, {month: 'Oct', price: 78, demand: 87},
      {month: 'Nov', price: 80, demand: 88}, {month: 'Dec', price: 79, demand: 87}
    ]
  },
  banana: {
    id: 'banana', name: 'Banana', emoji: '🍌', season: 'Year-round', duration: '11-13m',
    N: 100, P: 75, K: 100, temp: 27, hum: 80, ph: 6.5, rain: 1500,
    price: '₹25/kg', yield: '450q/ac', cost: '₹1,00,000', revenue: '₹11,25,000', profit: '₹10,25,000',
    desc: 'One of most important fruit crops with year-round production. Tissue culture ensures disease-free uniform yields. High potassium requirements. Drip irrigation with fertigation gives best results.',
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1603833797131-3c0a1b1e3c6b?w=800&h=600&fit=crop'],
    cultivation: 'Plant tissue culture plants in 60×60cm pits → High density 6×6ft spacing → Monthly de-suckering → Prop bunches',
    fertilizers: 'Monthly: 200g N + 100g P + 300g K per plant per cycle | Micronutrient spray every 60 days',
    selling: 'Wholesale fruit markets • Retail vendors • Supermarket chains • Export markets • Food processing units',
    videos: [{ title: 'Tissue Culture Banana', url: 'https://youtube.com/results?search_query=banana+cultivation', views: '2.8M' }],
    markets: [
      {month: 'Jan', price: 20, demand: 85}, {month: 'Feb', price: 22, demand: 87},
      {month: 'Mar', price: 25, demand: 90}, {month: 'Apr', price: 28, demand: 92},
      {month: 'May', price: 30, demand: 95}, {month: 'Jun', price: 27, demand: 90},
      {month: 'Jul', price: 24, demand: 87}, {month: 'Aug', price: 22, demand: 85},
      {month: 'Sep', price: 20, demand: 83}, {month: 'Oct', price: 22, demand: 85},
      {month: 'Nov', price: 25, demand: 88}, {month: 'Dec', price: 23, demand: 86}
    ]
  },

  mango: {
    id: 'mango', name: 'Mango', emoji: '🥭', season: 'Perennial', duration: '3-4y to bear',
    N: 100, P: 50, K: 100, temp: 27, hum: 65, ph: 6.5, rain: 1000,
    price: '₹45/kg', yield: '80q/ac', cost: '₹1,50,000', revenue: '₹3,60,000', profit: '₹2,10,000',
    desc: 'King of fruits with immense commercial value. Multiple varieties for different markets. Export potential for Alphonso, Kesar.',
    images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=600&fit=crop'],
    cultivation: 'Plant grafted saplings at 30×30ft → Regular irrigation in flowering/fruiting → Pest management',
    fertilizers: 'Annual: 250g N + 125g P + 250g K per tree | Split into 3 applications | Foliar spray',
    selling: 'Wholesale fruit markets • Retail markets • Export houses (APEDA) • Juice/pulp manufacturers',
    videos: [{ title: 'Mango Cultivation', url: 'https://youtube.com/results?search_query=mango+farming', views: '2.0M' }],
    markets: [
      {month: 'Jan', price: 35, demand: 70}, {month: 'Feb', price: 38, demand: 73},
      {month: 'Mar', price: 42, demand: 78}, {month: 'Apr', price: 48, demand: 90},
      {month: 'May', price: 55, demand: 98}, {month: 'Jun', price: 50, demand: 92},
      {month: 'Jul', price: 42, demand: 80}, {month: 'Aug', price: 38, demand: 72},
      {month: 'Sep', price: 35, demand: 68}, {month: 'Oct', price: 36, demand: 69},
      {month: 'Nov', price: 37, demand: 70}, {month: 'Dec', price: 36, demand: 69}
    ]
  },

  grapes: {
    id: 'grapes', name: 'Grapes', emoji: '🍇', season: 'Perennial', duration: '2-3y to bear',
    N: 80, P: 60, K: 120, temp: 25, hum: 60, ph: 6.5, rain: 700,
    price: '₹70/kg', yield: '120q/ac', cost: '₹2,50,000', revenue: '₹8,40,000', profit: '₹5,90,000',
    desc: 'Premium fruit crop with excellent export potential. Table grapes fetch high prices. Wine industry also consumes grapes.',
    images: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=800&h=600&fit=crop'],
    cultivation: 'Plant grafted vines at 12×6ft → Trellising system → Regular pruning → Bunch management',
    fertilizers: 'Per acre annual: 80kg N + 60kg P + 120kg K | Monthly fertigation | Micronutrient sprays',
    selling: 'Export markets (Europe, Middle East) • Wholesale fruit markets • Supermarkets • Wine industries',
    videos: [{ title: 'Grape Cultivation', url: 'https://youtube.com/results?search_query=grapes+farming', views: '1.8M' }],
    markets: [
      {month: 'Jan', price: 65, demand: 88}, {month: 'Feb', price: 70, demand: 92},
      {month: 'Mar', price: 75, demand: 95}, {month: 'Apr', price: 72, demand: 93},
      {month: 'May', price: 68, demand: 90}, {month: 'Jun', price: 65, demand: 87},
      {month: 'Jul', price: 62, demand: 85}, {month: 'Aug', price: 60, demand: 83},
      {month: 'Sep', price: 62, demand: 85}, {month: 'Oct', price: 65, demand: 87},
      {month: 'Nov', price: 68, demand: 90}, {month: 'Dec', price: 66, demand: 88}
    ]
  },

  watermelon: {
    id: 'watermelon', name: 'Watermelon', emoji: '🍉', season: 'Summer', duration: '90-100d',
    N: 80, P: 50, K: 80, temp: 28, hum: 65, ph: 6.5, rain: 500,
    price: '₹12/kg', yield: '200q/ac', cost: '₹35,000', revenue: '₹2,40,000', profit: '₹2,05,000',
    desc: 'High-value summer fruit with good market demand. Requires warm weather and adequate water.',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784422?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=800&h=600&fit=crop'],
    cultivation: 'Pit sowing at 2×2m spacing → Drip irrigation → Mulching → Support fruits with straw',
    fertilizers: 'Basal: FYM 10 tons + DAP 40kg + MOP 40kg | Top: Urea 40kg at vine growth',
    selling: 'Wholesale fruit markets • Retail markets • Juice industry • Export markets',
    videos: [{ title: 'Watermelon Cultivation', url: 'https://youtube.com/results?search_query=watermelon+farming', views: '1.5M' }],
    markets: [
      {month: 'Jan', price: 10, demand: 75}, {month: 'Feb', price: 11, demand: 78},
      {month: 'Mar', price: 13, demand: 85}, {month: 'Apr', price: 15, demand: 92},
      {month: 'May', price: 14, demand: 90}, {month: 'Jun', price: 12, demand: 82},
      {month: 'Jul', price: 11, demand: 78}, {month: 'Aug', price: 10, demand: 75},
      {month: 'Sep', price: 10, demand: 73}, {month: 'Oct', price: 11, demand: 76},
      {month: 'Nov', price: 12, demand: 80}, {month: 'Dec', price: 11, demand: 77}
    ]
  },

  muskmelon: {
    id: 'muskmelon', name: 'Muskmelon', emoji: '🍈', season: 'Summer', duration: '90-110d',
    N: 70, P: 50, K: 70, temp: 27, hum: 60, ph: 6.5, rain: 450,
    price: '₹20/kg', yield: '120q/ac', cost: '₹30,000', revenue: '₹2,40,000', profit: '₹2,10,000',
    desc: 'Sweet aromatic fruit with good market price. Requires warm climate and well-drained soil.',
    images: ['https://images.unsplash.com/photo-1621583441131-ab7352d0c5e4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop'],
    cultivation: 'Pit sowing 1.5×1.5m → Drip irrigation → Training on trellis → Harvest at maturity',
    fertilizers: 'Basal: FYM 8 tons + DAP 35kg + MOP 35kg | Top: Urea 35kg during flowering',
    selling: 'Wholesale fruit markets • Retail markets • Hotels and restaurants • Export markets',
    videos: [{ title: 'Muskmelon Cultivation', url: 'https://youtube.com/results?search_query=muskmelon+farming', views: '1.1M' }],
    markets: [
      {month: 'Jan', price: 18, demand: 72}, {month: 'Feb', price: 19, demand: 75},
      {month: 'Mar', price: 21, demand: 82}, {month: 'Apr', price: 24, demand: 90},
      {month: 'May', price: 23, demand: 88}, {month: 'Jun', price: 20, demand: 80},
      {month: 'Jul', price: 19, demand: 76}, {month: 'Aug', price: 18, demand: 73},
      {month: 'Sep', price: 18, demand: 71}, {month: 'Oct', price: 19, demand: 74},
      {month: 'Nov', price: 20, demand: 78}, {month: 'Dec', price: 19, demand: 75}
    ]
  },
  apple: {
    id: 'apple', name: 'Apple', emoji: '🍎', season: 'Perennial', duration: '3-4y to bear',
    N: 120, P: 60, K: 120, temp: 18, hum: 60, ph: 6.5, rain: 1100,
    price: '₹60/kg', yield: '100q/ac', cost: '₹2,00,000', revenue: '₹6,00,000', profit: '₹4,00,000',
    desc: 'Premium temperate fruit crop. Requires cold climate with chilling hours. High initial investment but excellent long-term returns.',
    images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop'],
    cultivation: 'Plant grafted saplings at 15×15ft → Regular pruning and training → Drip irrigation → IPM',
    fertilizers: 'Annual: 300g N + 150g P + 300g K per tree | Split into 4 applications | Micronutrients',
    selling: 'Fruit markets • Cold storage units • Supermarket chains • Juice manufacturers • Export (Gulf)',
    videos: [{ title: 'Apple Orchard Management', url: 'https://youtube.com/results?search_query=apple+cultivation', views: '1.4M' }],
    markets: [
      {month: 'Jan', price: 50, demand: 75}, {month: 'Feb', price: 52, demand: 77},
      {month: 'Mar', price: 55, demand: 80}, {month: 'Apr', price: 58, demand: 83},
      {month: 'May', price: 60, demand: 85}, {month: 'Jun', price: 62, demand: 87},
      {month: 'Jul', price: 65, demand: 90}, {month: 'Aug', price: 68, demand: 92},
      {month: 'Sep', price: 65, demand: 90}, {month: 'Oct', price: 60, demand: 85},
      {month: 'Nov', price: 55, demand: 80}, {month: 'Dec', price: 52, demand: 77}
    ]
  },

  orange: {
    id: 'orange', name: 'Orange', emoji: '🍊', season: 'Perennial', duration: '3-4y to bear',
    N: 100, P: 50, K: 80, temp: 25, hum: 65, ph: 6.5, rain: 1100,
    price: '₹35/kg', yield: '100q/ac', cost: '₹1,20,000', revenue: '₹3,50,000', profit: '₹2,30,000',
    desc: 'Important citrus fruit with good market demand. Rich in Vitamin C. Multiple harvest seasons.',
    images: ['https://images.unsplash.com/photo-1547514701-42782101795e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&h=600&fit=crop'],
    cultivation: 'Plant grafted saplings at 20×20ft → Regular irrigation → Pest management → Pruning',
    fertilizers: 'Annual: 300g N + 150g P + 250g K per tree | Split applications | Micronutrients',
    selling: 'Fruit markets • Juice industry • Retail markets • Export markets',
    videos: [{ title: 'Orange Cultivation', url: 'https://youtube.com/results?search_query=orange+farming', views: '1.3M' }],
    markets: [
      {month: 'Jan', price: 32, demand: 88}, {month: 'Feb', price: 34, demand: 90},
      {month: 'Mar', price: 36, demand: 92}, {month: 'Apr', price: 38, demand: 94},
      {month: 'May', price: 37, demand: 93}, {month: 'Jun', price: 35, demand: 90},
      {month: 'Jul', price: 33, demand: 87}, {month: 'Aug', price: 32, demand: 85},
      {month: 'Sep', price: 31, demand: 84}, {month: 'Oct', price: 32, demand: 85},
      {month: 'Nov', price: 34, demand: 88}, {month: 'Dec', price: 35, demand: 90}
    ]
  },

  papaya: {
    id: 'papaya', name: 'Papaya', emoji: '🍈', season: 'Year-round', duration: '10-12m',
    N: 100, P: 80, K: 100, temp: 27, hum: 70, ph: 6.5, rain: 1000,
    price: '₹18/kg', yield: '250q/ac', cost: '₹40,000', revenue: '₹4,50,000', profit: '₹4,10,000',
    desc: 'Fast-growing fruit crop with year-round bearing. Rich in papain enzyme. Good returns.',
    images: ['https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800&h=600&fit=crop'],
    cultivation: 'Plant at 2×2m spacing → Regular irrigation → Remove male plants → Support tall plants',
    fertilizers: 'Monthly: 100g N + 50g P + 100g K per plant | Micronutrient sprays',
    selling: 'Fruit markets • Retail vendors • Enzyme industry • Export markets',
    videos: [{ title: 'Papaya Farming', url: 'https://youtube.com/results?search_query=papaya+cultivation', views: '1.7M' }],
    markets: [
      {month: 'Jan', price: 16, demand: 82}, {month: 'Feb', price: 17, demand: 84},
      {month: 'Mar', price: 18, demand: 87}, {month: 'Apr', price: 20, demand: 90},
      {month: 'May', price: 19, demand: 88}, {month: 'Jun', price: 18, demand: 85},
      {month: 'Jul', price: 17, demand: 83}, {month: 'Aug', price: 16, demand: 81},
      {month: 'Sep', price: 16, demand: 80}, {month: 'Oct', price: 17, demand: 82},
      {month: 'Nov', price: 18, demand: 85}, {month: 'Dec', price: 17, demand: 83}
    ]
  },

  coconut: {
    id: 'coconut', name: 'Coconut', emoji: '🥥', season: 'Perennial', duration: '4-5y to bear',
    N: 80, P: 50, K: 120, temp: 27, hum: 75, ph: 6.5, rain: 1500,
    price: '₹25/nut', yield: '80nuts/tree', cost: '₹80,000', revenue: '₹2,00,000', profit: '₹1,20,000',
    desc: 'Versatile plantation crop providing coconut oil, water, copra. Long-term investment with steady returns.',
    images: ['https://images.unsplash.com/photo-1598516388728-84a160177f79?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1604600659589-17bbbb5a6c61?w=800&h=600&fit=crop'],
    cultivation: 'Plant at 25×25ft → Regular irrigation → Basin management → Intercropping possible',
    fertilizers: 'Annual: 500g N + 300g P + 1000g K per tree | Split into 4 applications',
    selling: 'Oil mills • Copra markets • Tender coconut vendors • Export markets',
    videos: [{ title: 'Coconut Farming', url: 'https://youtube.com/results?search_query=coconut+cultivation', views: '1.9M' }],
    markets: [
      {month: 'Jan', price: 23, demand: 80}, {month: 'Feb', price: 24, demand: 82},
      {month: 'Mar', price: 25, demand: 85}, {month: 'Apr', price: 27, demand: 88},
      {month: 'May', price: 26, demand: 86}, {month: 'Jun', price: 25, demand: 84},
      {month: 'Jul', price: 24, demand: 81}, {month: 'Aug', price: 23, demand: 79},
      {month: 'Sep', price: 23, demand: 78}, {month: 'Oct', price: 24, demand: 80},
      {month: 'Nov', price: 25, demand: 83}, {month: 'Dec', price: 24, demand: 81}
    ]
  },

  cotton: {
    id: 'cotton', name: 'Cotton', emoji: '☁️', season: 'Kharif', duration: '150-180d',
    N: 80, P: 40, K: 40, temp: 27, hum: 65, ph: 6.5, rain: 800,
    price: '₹6,500/q', yield: '15q/ac', cost: '₹45,000', revenue: '₹97,500', profit: '₹52,500',
    desc: 'White gold fiber crop. Bt cotton provides built-in pest resistance. High potassium crucial for fiber quality. Multiple pickings increase yield. Raw material for textile industry.',
    images: ['https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=600&fit=crop'],
    cultivation: 'Sow on ridges 90-120cm apart → Practice IPM → Pick cotton in 3-4 rounds when bolls open → Proper ginning',
    fertilizers: 'Basal: DAP 50kg + MOP 33kg | Top-1 (35d): Urea 33kg | Top-2 (60d): Urea 33kg + MOP 17kg',
    selling: 'Cotton Corporation of India (CCI) • Ginning mills • Textile mills • APMC cotton mandis • Export markets',
    videos: [{ title: 'Bt Cotton Farming', url: 'https://youtube.com/results?search_query=cotton+cultivation', views: '1.5M' }],
    markets: [
      {month: 'Jan', price: 6200, demand: 75}, {month: 'Feb', price: 6400, demand: 78},
      {month: 'Mar', price: 6600, demand: 80}, {month: 'Apr', price: 6800, demand: 82},
      {month: 'May', price: 6700, demand: 80}, {month: 'Jun', price: 6500, demand: 78},
      {month: 'Jul', price: 6300, demand: 75}, {month: 'Aug', price: 6200, demand: 73},
      {month: 'Sep', price: 6100, demand: 72}, {month: 'Oct', price: 6300, demand: 75},
      {month: 'Nov', price: 6500, demand: 78}, {month: 'Dec', price: 6400, demand: 77}
    ]
  },

  jute: {
    id: 'jute', name: 'Jute', emoji: '🌿', season: 'Kharif', duration: '120-150d',
    N: 60, P: 30, K: 40, temp: 27, hum: 75, ph: 6.5, rain: 1200,
    price: '₹4,500/q', yield: '25q/ac', cost: '₹30,000', revenue: '₹1,12,500', profit: '₹82,500',
    desc: 'Natural fiber crop known as golden fiber. Eco-friendly alternative to synthetic materials.',
    images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&h=600&fit=crop'],
    cultivation: 'Broadcast or line sowing → High humidity required → Retting after harvest → Fiber extraction',
    fertilizers: 'Basal: Urea 50kg + DAP 40kg + MOP 25kg | Top: Urea 40kg at 30 days',
    selling: 'Jute mills • Government agencies • Export markets • Packaging industry',
    videos: [{ title: 'Jute Cultivation', url: 'https://youtube.com/results?search_query=jute+farming', views: '0.9M' }],
    markets: [
      {month: 'Jan', price: 4300, demand: 72}, {month: 'Feb', price: 4400, demand: 74},
      {month: 'Mar', price: 4600, demand: 77}, {month: 'Apr', price: 4800, demand: 81},
      {month: 'May', price: 4700, demand: 79}, {month: 'Jun', price: 4500, demand: 76},
      {month: 'Jul', price: 4300, demand: 73}, {month: 'Aug', price: 4200, demand: 71},
      {month: 'Sep', price: 4100, demand: 70}, {month: 'Oct', price: 4200, demand: 71},
      {month: 'Nov', price: 4400, demand: 74}, {month: 'Dec', price: 4500, demand: 76}
    ]
  },

  coffee: {
  id: 'coffee', name: 'Coffee', emoji: '☕', season: 'Perennial', duration: '3-4y to bear',
  N: 80, P: 50, K: 80, temp: 22, hum: 70, ph: 6.5, rain: 1500,
  price: '₹180/kg', yield: '8q/ac', cost: '₹80,000', revenue: '₹1,44,000', profit: '₹64,000',
    desc: 'High-value plantation crop grown in hills. Arabica and Robusta varieties. Export-oriented crop.',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop'],
    cultivation: 'Plant under shade at 2×2m → Organic mulching → Proper drainage → Selective picking',
    fertilizers: 'Annual: 200g N + 100g P + 200g K per plant | Organic matter addition crucial',
    selling: 'Coffee Board • Export houses • Roasters and processors • Retail brands',
    videos: [{ title: 'Coffee Plantation', url: 'https://youtube.com/results?search_query=coffee+cultivation', views: '1.6M' }],
    markets: [
      {month: 'Jan', price: 175, demand: 82}, {month: 'Feb', price: 178, demand: 84},
      {month: 'Mar', price: 182, demand: 87}, {month: 'Apr', price: 186, demand: 90},
      {month: 'May', price: 184, demand: 88}, {month: 'Jun', price: 180, demand: 85},
      {month: 'Jul', price: 178, demand: 83}, {month: 'Aug', price: 175, demand: 81},
      {month: 'Sep', price: 174, demand: 80}, {month: 'Oct', price: 176, demand: 82},
      {month: 'Nov', price: 180, demand: 85}, {month: 'Dec', price: 182, demand: 87}
    ]
  },

  wheat: {
    id: 'wheat', name: 'Wheat', emoji: '🌾', season: 'Rabi', duration: '120-150d',
    N: 50, P: 40, K: 40, temp: 22, hum: 60, ph: 6.5, rain: 600,
    price: '₹2,500/q', yield: '40q/ac', cost: '₹32,000', revenue: '₹1,00,000', profit: '₹68,000',
    desc: 'Second most important cereal globally. Cool-season crop requiring well-drained loamy soils. Semi-dwarf varieties dramatically increased productivity. Needs 5-6 irrigations at critical stages.',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop'],
    cultivation: 'Fine seedbed → Line sowing at 20cm spacing in Nov → Irrigate at CRI/tillering/flowering → Harvest at 20-25% grain moisture',
    fertilizers: 'Basal: DAP 65kg + MOP 17kg | Top-1 (21d): Urea 43kg | Top-2 (45d): Urea 43kg',
    selling: 'FCI centers (MSP ₹2,275/q) • Flour mills • Biscuit industries • Pasta manufacturers • APMC mandis',
    videos: [{ title: 'Modern Wheat Farming', url: 'https://youtube.com/results?search_query=wheat+cultivation', views: '1.8M' }],
    markets: [
      {month: 'Jan', price: 2400, demand: 70}, {month: 'Feb', price: 2500, demand: 75},
      {month: 'Mar', price: 2700, demand: 85}, {month: 'Apr', price: 2800, demand: 95},
      {month: 'May', price: 2600, demand: 88}, {month: 'Jun', price: 2450, demand: 80},
      {month: 'Jul', price: 2400, demand: 75}, {month: 'Aug', price: 2350, demand: 72},
      {month: 'Sep', price: 2300, demand: 70}, {month: 'Oct', price: 2350, demand: 72},
      {month: 'Nov', price: 2400, demand: 78}, {month: 'Dec', price: 2450, demand: 80}
    ]
  },

  apple_alt: {
    id: 'apple', name: 'Apple', emoji: '🍏', season: 'Perennial', duration: '3-4y',
    N: 120, P: 60, K: 120, temp: 18, hum: 60, ph: 6.5, rain: 1100,
    price: '₹60/kg', yield: '100q/ac', cost: '₹2,00,000', revenue: '₹6,00,000', profit: '₹4,00,000',
    desc: 'Premium temperate fruit requiring cold climate. High value crop with excellent export potential.',
    images: ['https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?w=800&h=600&fit=crop'],
    cultivation: 'Grafted saplings → Cold storage → Regular pruning → IPM',
    fertilizers: 'NPK split applications | Micronutrients | Organic matter',
    selling: 'Premium markets • Cold storage • Export • Juice industry',
    videos: [{ title: 'Apple Farming Guide', url: 'https://youtube.com/results?search_query=apple+orchard', views: '1.4M' }],
    markets: [
      {month: 'Jan', price: 55, demand: 78}, {month: 'Feb', price: 57, demand: 80},
      {month: 'Mar', price: 60, demand: 85}, {month: 'Apr', price: 62, demand: 88},
      {month: 'May', price: 64, demand: 90}, {month: 'Jun', price: 66, demand: 92},
      {month: 'Jul', price: 68, demand: 94}, {month: 'Aug', price: 70, demand: 96},
      {month: 'Sep', price: 68, demand: 94}, {month: 'Oct', price: 64, demand: 90},
      {month: 'Nov', price: 60, demand: 85}, {month: 'Dec', price: 57, demand: 80}
    ]
  },

  mustard: {
    id: 'mustard', name: 'Mustard', emoji: '🌼', season: 'Rabi', duration: '90-120d',
    N: 60, P: 40, K: 20, temp: 20, hum: 60, ph: 6.5, rain: 450,
    price: '₹5,500/q', yield: '15q/ac', cost: '₹18,000', revenue: '₹82,500', profit: '₹64,500',
    desc: 'Important oilseed crop for mustard oil production. Short duration and cold tolerant. Oil content 38-42%.',
    images: ['https://images.unsplash.com/photo-1588421942099-e4fa061d6e2e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583468964582-c07cbdaa3925?w=800&h=600&fit=crop'],
    cultivation: 'Line sowing at 30cm spacing in October-November → One irrigation at flowering → Harvest when pods yellow',
    fertilizers: 'Basal: DAP 40kg + MOP 12kg + Sulfur 20kg | Top: Urea 43kg at 30 days',
    selling: 'Oil mills • APMC mandis • Government procurement • Wholesale markets',
    videos: [{ title: 'Mustard Farming', url: 'https://youtube.com/results?search_query=mustard+cultivation', views: '1.3M' }],
    markets: [
      {month: 'Jan', price: 5300, demand: 80}, {month: 'Feb', price: 5400, demand: 82},
      {month: 'Mar', price: 5600, demand: 86}, {month: 'Apr', price: 5800, demand: 90},
      {month: 'May', price: 5700, demand: 88}, {month: 'Jun', price: 5500, demand: 84},
      {month: 'Jul', price: 5300, demand: 81}, {month: 'Aug', price: 5200, demand: 79},
      {month: 'Sep', price: 5100, demand: 78}, {month: 'Oct', price: 5200, demand: 79},
      {month: 'Nov', price: 5400, demand: 82}, {month: 'Dec', price: 5500, demand: 84}
    ]
  },
  sunflower: {
    id: 'sunflower', name: 'Sunflower', emoji: '🌻', season: 'Kharif/Rabi', duration: '90-110d',
    N: 60, P: 50, K: 40, temp: 25, hum: 60, ph: 6.5, rain: 600,
    price: '₹6,200/q', yield: '18q/ac', cost: '₹22,000', revenue: '₹1,11,600', profit: '₹89,600',
    desc: 'Important oilseed crop with high oil content (40-45%). Seeds used for edible oil extraction. Cake used as cattle feed. Drought-tolerant and grows well on marginal lands. Short duration allows multiple cropping.',
    images: ['https://images.unsplash.com/photo-1597848212624-e530bb09e1e7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800&h=600&fit=crop'],
    cultivation: 'Prepare field with 2-3 plowings → Sow seeds at 45×30cm spacing → Thin to 1 plant per hill → Light irrigation at flowering and seed filling → Harvest when back of head turns yellow',
    fertilizers: 'Basal: DAP 50kg + MOP 30kg + Boron 10kg | Top-1 (30d): Urea 50kg | Top-2 (45d): Urea 30kg',
    selling: 'Oil mills • APMC mandis • Government procurement • Seed companies • Export markets',
    videos: [{ title: 'Sunflower Hybrid Cultivation', url: 'https://youtube.com/results?search_query=sunflower+cultivation', views: '1.2M' }],
    markets: [
      {month: 'Jan', price: 6000, demand: 78}, {month: 'Feb', price: 6100, demand: 80},
      {month: 'Mar', price: 6300, demand: 83}, {month: 'Apr', price: 6500, demand: 87},
      {month: 'May', price: 6400, demand: 85}, {month: 'Jun', price: 6200, demand: 82},
      {month: 'Jul', price: 6000, demand: 79}, {month: 'Aug', price: 5900, demand: 77},
      {month: 'Sep', price: 5800, demand: 76}, {month: 'Oct', price: 5900, demand: 77},
      {month: 'Nov', price: 6100, demand: 80}, {month: 'Dec', price: 6200, demand: 82}
    ]
  },

  barley: {
    id: 'barley', name: 'Barley', emoji: '🌾', season: 'Rabi', duration: '110-130d',
    N: 40, P: 30, K: 20, temp: 18, hum: 55, ph: 6.5, rain: 500,
    price: '₹2,000/q', yield: '30q/ac', cost: '₹25,000', revenue: '₹60,000', profit: '₹35,000',
    desc: 'Ancient cereal crop used for malt production, animal feed, and food. More drought and salt tolerant than wheat. Used in brewing industry for beer and whiskey production. Nutritious grain with high fiber content.',
    images: ['https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop'],
    cultivation: 'Prepare fine seedbed → Line sowing at 20cm spacing in November → Light irrigation at CRI, tillering, and grain filling → Harvest when grains hard and straw yellow',
    fertilizers: 'Basal: DAP 50kg + MOP 15kg | Top-1 (21d): Urea 35kg | Top-2 (40d): Urea 30kg',
    selling: 'Malt industries • Breweries • Animal feed mills • Food processing units • APMC mandis',
    videos: [{ title: 'Barley Cultivation Guide', url: 'https://youtube.com/results?search_query=barley+farming', views: '0.8M' }],
    markets: [
      {month: 'Jan', price: 1900, demand: 72}, {month: 'Feb', price: 1950, demand: 75},
      {month: 'Mar', price: 2000, demand: 80}, {month: 'Apr', price: 2100, demand: 88},
      {month: 'May', price: 2050, demand: 85}, {month: 'Jun', price: 2000, demand: 80},
      {month: 'Jul', price: 1950, demand: 76}, {month: 'Aug', price: 1900, demand: 73},
      {month: 'Sep', price: 1850, demand: 71}, {month: 'Oct', price: 1900, demand: 73},
      {month: 'Nov', price: 1950, demand: 76}, {month: 'Dec', price: 2000, demand: 80}
    ]
  },

  soybean: {
    id: 'soybean', name: 'Soybean', emoji: '🫛', season: 'Kharif', duration: '90-120d',
    N: 20, P: 60, K: 40, temp: 26, hum: 65, ph: 6.5, rain: 750,
    price: '₹4,500/q', yield: '20q/ac', cost: '₹24,000', revenue: '₹90,000', profit: '₹66,000',
    desc: 'Miracle crop rich in protein (40%) and oil (20%). Nitrogen-fixing legume improving soil health. Used for oil extraction, soy milk, tofu, and animal feed. High export demand for soy meal and oil.',
    images: ['https://images.unsplash.com/photo-1589927986089-35812388d1f8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1594804405876-f7ef6daa7c67?w=800&h=600&fit=crop'],
    cultivation: 'Sow at 45×5cm spacing after seed treatment with Rhizobium → Weed control critical in first 45 days → Light irrigation at flowering and pod filling → Harvest when 95% pods mature',
    fertilizers: 'Basal: DAP 50kg + MOP 30kg + Rhizobium culture | Top: Urea 20kg only if deficiency symptoms appear',
    selling: 'Oil mills • Soy processing units • Export markets • Animal feed manufacturers • APMC mandis',
    videos: [{ title: 'Soybean Cultivation', url: 'https://youtube.com/results?search_query=soybean+farming', views: '1.5M' }],
    markets: [
      {month: 'Jan', price: 4300, demand: 82}, {month: 'Feb', price: 4400, demand: 84},
      {month: 'Mar', price: 4600, demand: 87}, {month: 'Apr', price: 4800, demand: 91},
      {month: 'May', price: 4700, demand: 89}, {month: 'Jun', price: 4500, demand: 86},
      {month: 'Jul', price: 4300, demand: 83}, {month: 'Aug', price: 4200, demand: 81},
      {month: 'Sep', price: 4100, demand: 80}, {month: 'Oct', price: 4200, demand: 81},
      {month: 'Nov', price: 4400, demand: 84}, {month: 'Dec', price: 4500, demand: 86}
    ]
  },

  sugarcane: {
    id: 'sugarcane', name: 'Sugarcane', emoji: '🎋', season: 'Year-round', duration: '10-12m',
    N: 100, P: 60, K: 60, temp: 28, hum: 75, ph: 6.5, rain: 1500,
    price: '₹325/q', yield: '350q/ac', cost: '₹60,000', revenue: '₹1,13,750', profit: '₹53,750',
    desc: 'Major cash crop for sugar production. Long-duration crop giving high biomass. Bagasse used in paper industry and power generation. Molasses used for ethanol and alcohol production. Requires high water and nutrients.',
    images: ['https://images.unsplash.com/photo-1578852243116-4fa5b684c24b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800&h=600&fit=crop'],
    cultivation: 'Plant 3-budded setts in furrows at 90cm spacing → Earthing up after 90 days → Regular irrigation every 10-15 days → Trash mulching conserves moisture → Harvest at 10-12 months',
    fertilizers: 'Basal: FYM 10 tons + DAP 65kg + MOP 40kg | Top-1 (45d): Urea 110kg | Top-2 (90d): Urea 110kg + MOP 40kg',
    selling: 'Sugar mills (FRP ₹315/q) • Jaggery units • Juice centers • Ethanol plants • Direct consumption',
    videos: [{ title: 'Sugarcane Cultivation', url: 'https://youtube.com/results?search_query=sugarcane+farming', views: '2.2M' }],
    markets: [
      {month: 'Jan', price: 310, demand: 88}, {month: 'Feb', price: 315, demand: 90},
      {month: 'Mar', price: 325, demand: 94}, {month: 'Apr', price: 335, demand: 96},
      {month: 'May', price: 330, demand: 95}, {month: 'Jun', price: 325, demand: 92},
      {month: 'Jul', price: 320, demand: 89}, {month: 'Aug', price: 315, demand: 87},
      {month: 'Sep', price: 310, demand: 85}, {month: 'Oct', price: 315, demand: 87},
      {month: 'Nov', price: 320, demand: 90}, {month: 'Dec', price: 325, demand: 92}
    ]
  }
};
// MAIN APP COMPONENT
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [soilData, setSoilData] = useState({
    N: 60, P: 50, K: 50, ph: 6.8, temp: 26, hum: 70, rain: 900
  });
  const [recommendations, setRecommendations] = useState([]);

  // REAL-TIME WEATHER FETCH using OpenWeatherMap API
  useEffect(() => {
    const fetchRealWeather = async () => {
      try {
        setWeatherLoading(true);
        
        // Fetch weather for Bengaluru (works worldwide - just change city name)
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Bengaluru,IN&units=metric&appid=${WEATHER_API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          setWeather({
            temp: Math.round(data.main.temp),
            humidity: data.main.humidity,
            condition: data.weather[0].main,
            rainfall: 850, // Annual average (API doesn't provide annual data)
            location: 'Bengaluru, Karnataka'
          });
          
          console.log('✓ Real weather data loaded');
        } else {
          throw new Error('Weather API failed');
        }
      } catch (error) {
        console.log('Using default weather data:', error.message);
        // Fallback to default values if API fails
        setWeather({
          temp: 26,
          humidity: 72,
          condition: 'Partly Cloudy',
          rainfall: 850,
          location: 'Bengaluru, Karnataka'
        });
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchRealWeather();
    
    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(fetchRealWeather, 600000);
    
    return () => clearInterval(weatherInterval);
  }, []);

  // CALCULATE SUITABILITY SCORE (Fallback if ML model is not available)
  const calculateSuitability = (crop) => {
    const { N, P, K, temp, hum, ph, rain } = soilData;
    let score = 0;
    
    score += Math.max(0, 100 - Math.abs(crop.N - N) * 2);
    score += Math.max(0, 100 - Math.abs(crop.P - P) * 2);
    score += Math.max(0, 100 - Math.abs(crop.K - K) * 2);
    score += Math.max(0, 100 - Math.abs(crop.temp - temp) * 3);
    score += Math.max(0, 100 - Math.abs(crop.hum - hum) * 1.5);
    score += Math.max(0, 100 - Math.abs(crop.ph - ph) * 10);
    score += Math.max(0, 100 - Math.abs(crop.rain - rain) / 10);
    
    return Math.round(score / 7);
  };

  // GET RECOMMENDATIONS from ML Model Backend
  const getRecommendations = async () => {
    try {
      console.log('Calling ML model backend...');
      
      // Call Flask backend API
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          N: soilData.N,
          P: soilData.P,
          K: soilData.K,
          temp: soilData.temp,
          hum: soilData.hum,
          ph: soilData.ph,
          rain: soilData.rain
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.recommendations) {
        console.log('✓ ML Model predictions received');
        
        // Map ML predictions to frontend CROPS_DB
        const mappedRecommendations = result.recommendations.map(rec => {
          const cropData = CROPS_DB[rec.id] || CROPS_DB[rec.name.toLowerCase()];
          if (cropData) {
            return {
              ...cropData,
              suitability: rec.suitability
            };
          }
          return null;
        }).filter(Boolean);
        
        setRecommendations(mappedRecommendations.slice(0, 6));
        setCurrentView('results');
      } else {
        throw new Error('Invalid response from ML model');
      }
      
    } catch (error) {
      console.warn('ML Model unavailable, using fallback algorithm:', error.message);
      
      // Fallback: Use local calculation if backend is down
      const scored = Object.values(CROPS_DB).map(crop => ({
        ...crop,
        suitability: calculateSuitability(crop)
      }));
      
      const sorted = scored.sort((a, b) => b.suitability - a.suitability);
      setRecommendations(sorted.slice(0, 6));
      setCurrentView('results');
      
      // Show user-friendly message
      alert('Using offline prediction mode. Start backend server for ML predictions.');
    }
  };

  // Handle input changes without page jump
  const handleInputChange = (field, value) => {
    setSoilData(prev => ({
      ...prev,
      [field]: value === '' ? 0 : parseFloat(value)
    }));
  };
  
  // HOME PAGE COMPONENT - CLEAR BACKGROUND & FIXED CURSOR
  const HomePage = () => {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 50%, #6b9b47 100%)' }}>
        {/* Header */}
        <div style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '20px 0', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #4a7c2c, #6b9b47)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                🌾
              </div>
              <h1 style={{ color: '#2d5016', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Smart Crop Advisor</h1>
            </div>
            <div style={{ color: '#4a7c2c', background: '#e8f5e9', padding: '10px 20px', borderRadius: '25px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📍</span> {location}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' }}>
          {/* Title Section */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '46px', fontWeight: 'bold', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              AI-Powered Crop Recommendations
            </h2>
            <p style={{ color: '#e8f5e9', fontSize: '20px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
              Get personalized crop suggestions based on soil parameters, weather conditions, and market trends
            </p>
          </div>

          {/* Weather Card */}
          {weather && !weatherLoading ? (
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '28px' }}>🌤️</span>
                <h3 style={{ color: '#2d5016', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Current Weather Conditions</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#e8f5e9', borderRadius: '12px' }}>
                  <div style={{ color: '#f57c00', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{weather.temp}°C</div>
                  <div style={{ color: '#4a7c2c', fontSize: '14px', fontWeight: '600' }}>Temperature</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#e3f2fd', borderRadius: '12px' }}>
                  <div style={{ color: '#1976d2', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{weather.humidity}%</div>
                  <div style={{ color: '#1565c0', fontSize: '14px', fontWeight: '600' }}>Humidity</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#e8f5e9', borderRadius: '12px' }}>
                  <div style={{ color: '#388e3c', fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>{weather.rainfall}mm</div>
                  <div style={{ color: '#2e7d32', fontSize: '14px', fontWeight: '600' }}>Annual Rainfall</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#fff3e0', borderRadius: '12px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>☁️</div>
                  <div style={{ color: '#e65100', fontSize: '14px', fontWeight: '600' }}>{weather.condition}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Soil Parameters Form - VERY CLEAR BACKGROUND */}
          <div style={{ 
            position: 'relative',
            borderRadius: '20px', 
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
          }}>
            {/* Background Image - MUCH BRIGHTER */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=90)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.8) saturate(1.3) contrast(1.1)',
              zIndex: 0
            }}></div>

            {/* Very Light Overlay - Image Clearly Visible */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(139, 195, 74, 0.4), rgba(156, 204, 101, 0.35))',
              zIndex: 1
            }}></div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, padding: '50px 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '35px', justifyContent: 'center' }}>
                <span style={{ fontSize: '40px' }}>📊</span>
                <h3 style={{ color: 'white', margin: 0, fontSize: '32px', fontWeight: 'bold', textShadow: '3px 3px 6px rgba(0,0,0,0.7)' }}>Enter Your Soil Parameters</h3>
              </div>
              
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Nitrogen */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="nitrogen" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    Nitrogen (N) - kg/ha
                  </label>
                  <input
                    id="nitrogen"
                      name="nitrogen"
                    type="number"
                        value={soilData.N}
                    onChange={(e) => handleInputChange('N', e.target.value)}
                      style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* Phosphorus */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="phosphorus" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    Phosphorus (P) - kg/ha
                  </label>
                       <input
  id="phosphorus"
  name="phosphorus"
  type="number"
  value={soilData.P}
  onChange={(e) => handleInputChange('P', e.target.value)}
  style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* Potassium */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="potassium" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    Potassium (K) - kg/ha
                  </label>
                  <input
  id="potassium"
  name="potassium"
  type="number"
  value={soilData.K}
  onChange={(e) => handleInputChange('K', e.target.value)}
  style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* pH */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="ph" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    pH Level
                  </label>
                  <input
  id="ph"
  name="ph"
  type="number"
  step="0.1"
  value={soilData.ph}
  onChange={(e) => handleInputChange('ph', e.target.value)}
  style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* Temperature */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="temperature" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    Temperature - °C
                  </label>
                  <input
  id="temperature"
  name="temperature"
  type="number"
  value={soilData.temp}
  onChange={(e) => handleInputChange('temp', e.target.value)}
  style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* Humidity */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="humidity" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    Humidity - %
                  </label>
                  <input
  id="humidity"
  name="humidity"
  type="number"
  value={soilData.hum}
  onChange={(e) => handleInputChange('hum', e.target.value)}
  style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* Rainfall */}
                <div style={{ marginBottom: '35px' }}>
                  <label htmlFor="rainfall" style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '700', fontSize: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    Rainfall - mm
                  </label>
                  <input
  id="rainfall"
  name="rainfall"
  type="number"
  value={soilData.rain}
  onChange={(e) => handleInputChange('rain', e.target.value)}
  style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#2d5016',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={getRecommendations}
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: 'white',
                    color: '#2d5016',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                  }}
                >
                   Get Crop Recommendations
                </button>
              </div>
            </div>
          </div>

          {/* Browse Button */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button
              onClick={() => setCurrentView('browse')}
              style={{
                padding: '15px 40px',
                background: 'rgba(255,255,255,0.95)',
                color: '#2d5016',
                border: '2px solid white',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              Browse All 29 Crops
            </button>
          </div>
        </div>
      </div>
    );
  };
  // RESULTS PAGE - Top 6 Recommendations
  const ResultsPage = () => {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '20px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <h1 style={{ color: '#2d5016', margin: 0, fontSize: '28px', fontWeight: 'bold' }}> Top 6 Crop Recommendations</h1>
            <button 
              onClick={() => setCurrentView('home')} 
              style={{ background: '#609e3cff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {recommendations.map((crop, index) => (
              <div
                key={crop.id}
                onClick={() => {
                  setSelectedCrop(crop);
                  setCurrentView('detail');
                }}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '3px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
                  e.currentTarget.style.borderColor = '#4a7c2c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Rank Badge */}
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: CHART_COLORS[index], color: 'white', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                  #{index + 1}
                </div>

                <div style={{ fontSize: '70px', textAlign: 'center', marginBottom: '15px' }}>{crop.emoji}</div>
                <h3 style={{ textAlign: 'center', color: '#2d5016', marginBottom: '8px', fontSize: '26px', fontWeight: 'bold' }}>{crop.name}</h3>
                <p style={{ textAlign: 'center', color: '#6b9b47', fontSize: '13px', marginBottom: '20px', fontStyle: 'italic' }}>{crop.scientificName || crop.season}</p>

                {/* Suitability Score */}
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#4a7c2c', fontWeight: '700', fontSize: '15px' }}>Suitability Score</span>
                    <span style={{ color: CHART_COLORS[index], fontWeight: 'bold', fontSize: '20px' }}>{crop.suitability}%</span>
                  </div>
                  <div style={{ background: '#e8f5e9', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
                    <div style={{ background: `linear-gradient(90deg, ${CHART_COLORS[index]}, ${CHART_COLORS[(index + 1) % CHART_COLORS.length]})`, width: `${crop.suitability}%`, height: '100%', transition: 'width 0.8s ease' }}></div>
                  </div>
                </div>

                {/* Key Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '10px', border: '1px solid #c8e6c9' }}>
                    <div style={{ color: '#4a7c2c', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>Season</div>
                    <div style={{ color: '#2d5016', fontWeight: 'bold', fontSize: '14px' }}>{crop.season}</div>
                  </div>
                  <div style={{ background: '#fff3e0', padding: '12px', borderRadius: '10px', border: '1px solid #ffe0b2' }}>
                    <div style={{ color: '#e65100', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>Duration</div>
                    <div style={{ color: '#bf360c', fontWeight: 'bold', fontSize: '14px' }}>{crop.duration}</div>
                  </div>
                  <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '10px', border: '1px solid #c8e6c9' }}>
                    <div style={{ color: '#2e7d32', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>Expected Yield</div>
                    <div style={{ color: '#1b5e20', fontWeight: 'bold', fontSize: '14px' }}>{crop.yield}</div>
                  </div>
                  <div style={{ background: '#fff9c4', padding: '12px', borderRadius: '10px', border: '1px solid #fff59d' }}>
                    <div style={{ color: '#f57f17', fontSize: '11px', marginBottom: '4px', fontWeight: '600' }}>Market Price</div>
                    <div style={{ color: '#f57f17', fontWeight: 'bold', fontSize: '14px' }}>{crop.price}</div>
                  </div>
                </div>

                {/* Profit Banner */}
                <div style={{ background: 'linear-gradient(135deg, #4a7c2c, #6b9b47)', padding: '18px', borderRadius: '12px', color: 'white', textAlign: 'center', boxShadow: '0 4px 15px rgba(74, 124, 44, 0.3)' }}>
                  <div style={{ fontSize: '12px', marginBottom: '5px', opacity: 0.95, fontWeight: '600' }}>Expected Profit per Acre</div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{crop.profit}</div>
                </div>

                <div style={{ marginTop: '20px', padding: '14px', background: '#fff3e0', borderRadius: '10px', textAlign: 'center', color: '#e65100', fontSize: '14px', fontWeight: '700', border: '2px solid #ffe0b2' }}>
                  Click for Detailed Analysis →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // BROWSE ALL CROPS PAGE
  const BrowsePage = () => {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2d5016 0%, #6b9b47 100%)' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '20px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <h1 style={{ color: '#2d5016', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>🌱 Complete Crops Database (29 Crops)</h1>
            <button 
              onClick={() => setCurrentView('home')} 
              style={{ background: '#4a7c2c', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ← Home
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {Object.values(CROPS_DB).map((crop) => (
              <div
                key={crop.id}
                onClick={() => {
                  setSelectedCrop(crop);
                  setCurrentView('detail');
                }}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.12)',
                  border: '2px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                  e.currentTarget.style.borderColor = '#4a7c2c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ fontSize: '55px', textAlign: 'center', marginBottom: '12px' }}>{crop.emoji}</div>
                <h4 style={{ textAlign: 'center', color: '#2d5016', marginBottom: '6px', fontSize: '20px', fontWeight: 'bold' }}>{crop.name}</h4>
                <p style={{ textAlign: 'center', color: '#6b9b47', fontSize: '12px', marginBottom: '18px', fontWeight: '600' }}>{crop.season} • {crop.duration}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '8px 0', borderTop: '1px solid #e8f5e9' }}>
                  <span style={{ color: '#4a7c2c', fontSize: '13px', fontWeight: '600' }}>Yield:</span>
                  <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '13px' }}>{crop.yield}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#4a7c2c', fontSize: '13px', fontWeight: '600' }}>Profit:</span>
                  <span style={{ color: '#f57f17', fontWeight: 'bold', fontSize: '13px' }}>{crop.profit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // DETAIL PAGE - Complete Crop Analysis
  const DetailPage = () => {
    if (!selectedCrop) return null;

    return (
      <div style={{ minHeight: '100vh', background: '#d8f3ffff' }}>
        {/* Sticky Header */}
        <div style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2c)', padding: '25px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '50px' }}>{selectedCrop.emoji}</span>
              <div>
                <h1 style={{ color: 'white', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{selectedCrop.name}</h1>
                <p style={{ color: '#c8e6c9', margin: '5px 0 0 0', fontSize: '15px', fontStyle: 'italic' }}>{selectedCrop.scientificName || selectedCrop.season}</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView(recommendations.length > 0 ? 'results' : 'browse')} 
              style={{ background: 'rgba(255,255,255,0.95)', color: '#2d5016', border: 'none', padding: '14px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            >
              ← Back
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Hero Images Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
            {selectedCrop.images && selectedCrop.images.map((img, i) => (
              <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', height: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <img 
                  src={img} 
                  alt={`${selectedCrop.name} ${i + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #c8e6c9, #a5d6a7)';
                    e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:80px">${selectedCrop.emoji}</div>`;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Key Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { label: 'Season', value: selectedCrop.season, color: '#4a7c2c', icon: '🌤️', bg: '#e8f5e9' },
              { label: 'Duration', value: selectedCrop.duration, color: '#1976d2', icon: '⏱️', bg: '#e3f2fd' },
              { label: 'Expected Yield', value: selectedCrop.yield, color: '#388e3c', icon: '📊', bg: '#e8f5e9' },
              { label: 'Market Price', value: selectedCrop.price, color: '#f57c00', icon: '💰', bg: '#fff3e0' },
              { label: 'Total Cost', value: selectedCrop.cost, color: '#d32f2f', icon: '💸', bg: '#ffebee' },
              { label: 'Net Profit', value: selectedCrop.profit, color: '#0288d1', icon: '✨', bg: '#e1f5fe' }
            ].map((stat, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '25px', textAlign: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', border: `3px solid ${stat.bg}` }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ color: '#757575', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>{stat.label}</div>
                <div style={{ color: stat.color, fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#2d5016', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #4a7c2c', paddingLeft: '20px' }}>
              📖 Overview
            </h2>
            <p style={{ color: '#424242', lineHeight: '1.9', fontSize: '16px', textAlign: 'justify' }}>{selectedCrop.desc}</p>
          </div>

          {/* Market Trends Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px', marginBottom: '30px' }}>
            {/* Price Trends */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '35px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#2d5016', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📈</span> Market Price Trends
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={selectedCrop.markets}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a7c2c" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4a7c2c" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#616161" style={{ fontSize: '13px' }} />
                  <YAxis stroke="#616161" style={{ fontSize: '13px' }} />
                  <Tooltip 
                    contentStyle={{ background: 'white', border: '2px solid #4a7c2c', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#2d5016', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#4a7c2c" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Demand Trends */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '35px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#2d5016', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📊</span> Demand Trends
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={selectedCrop.markets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#616161" style={{ fontSize: '13px' }} />
                  <YAxis stroke="#616161" style={{ fontSize: '13px' }} />
                  <Tooltip 
                    contentStyle={{ background: 'white', border: '2px solid #1976d2', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#1565c0', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="demand" stroke="#1976d2" strokeWidth={3} dot={{ fill: '#1976d2', r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cultivation Guide */}
<div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
  <h2 style={{ color: '#2d5016', marginBottom: '25px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #f57c00', paddingLeft: '20px' }}>
    🌱 Cultivation Guide
  </h2>
  <div style={{ background: '#fff3e0', padding: '28px', borderRadius: '15px', border: '3px solid #ffe0b2' }}>
    <p style={{ color: '#e65100', lineHeight: '2', fontSize: '16px', margin: 0, fontWeight: '500', marginBottom: '20px' }}>
      {selectedCrop.cultivation}
    </p>
    
    {/* Additional Cultivation Details */}
    <div style={{ borderTop: '2px dashed #ffe0b2', paddingTop: '20px', marginTop: '20px' }}>
      <h4 style={{ color: '#bf360c', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💰</span> Cultivation Cost Breakdown
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#bf360c', marginBottom: '4px' }}>Land Preparation</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹3,000-5,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Plowing, leveling, equipment</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#bf360c', marginBottom: '4px' }}>Seeds/Planting Material</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹2,000-8,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Quality certified seeds</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#bf360c', marginBottom: '4px' }}>Irrigation & Water</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹4,000-12,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Electricity, diesel, drip setup</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#bf360c', marginBottom: '4px' }}>Labor Charges</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹8,000-15,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Sowing, weeding, harvesting</div>
        </div>
      </div>
      <div style={{ background: 'rgba(239, 108, 0, 0.1)', padding: '15px', borderRadius: '10px', marginTop: '15px' }}>
        <p style={{ color: '#e65100', fontSize: '14px', margin: 0, lineHeight: '1.8' }}>
          <strong>⚠️ Important Tips:</strong> Use certified seeds from government-approved agencies for 20-30% higher yields. 
          Implement drip irrigation to save 40-50% water costs. Plan labor requirements in advance during peak seasons to avoid delays. 
          Maintain proper spacing between plants for optimal growth and easier farm operations. Keep detailed records of all expenses for better financial planning.
        </p>
      </div>
    </div>
  </div>
</div>

{/* Fertilizer Schedule */}
<div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
  <h2 style={{ color: '#2d5016', marginBottom: '25px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #388e3c', paddingLeft: '20px' }}>
    💊 Fertilizer Schedule
  </h2>
  <div style={{ background: '#e8f5e9', padding: '28px', borderRadius: '15px', border: '3px solid #c8e6c9' }}>
    <p style={{ color: '#1b5e20', lineHeight: '2', fontSize: '16px', margin: 0, fontWeight: '500', marginBottom: '20px' }}>
      {selectedCrop.fertilizers}
    </p>
    
    {/* Additional Fertilizer Details */}
    <div style={{ borderTop: '2px dashed #c8e6c9', paddingTop: '20px', marginTop: '20px' }}>
      <h4 style={{ color: '#1b5e20', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💰</span> Fertilizer Cost Breakdown (Per Acre)
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '4px' }}>Urea (Nitrogen)</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20' }}>₹1,500-3,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>₹6-7 per kg</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '4px' }}>DAP (Phosphorus)</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20' }}>₹2,000-4,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>₹27-30 per kg</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '4px' }}>MOP (Potassium)</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20' }}>₹800-1,500</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>₹18-22 per kg</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#2e7d32', marginBottom: '4px' }}>Micronutrients & Organic</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20' }}>₹1,500-3,500</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Zinc, Boron, FYM, compost</div>
        </div>
      </div>
      <div style={{ background: 'rgba(76, 175, 80, 0.1)', padding: '15px', borderRadius: '10px', marginTop: '15px' }}>
        <p style={{ color: '#1b5e20', fontSize: '14px', margin: 0, lineHeight: '1.8' }}>
          <strong>✅ Pro Tips:</strong> Apply fertilizers based on soil test results to avoid wastage and save 20-30% costs. 
          Split nitrogen applications for better absorption and reduced leaching losses. Use bio-fertilizers (Rhizobium, Azospirillum) 
          to reduce chemical fertilizer requirement by 25%. Apply organic manure (FYM) 2-3 weeks before sowing to improve soil health. 
          Foliar sprays during critical growth stages boost yields by 10-15%. Store fertilizers in cool, dry place to prevent nutrient loss.
        </p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #4a7c2c, #6b9b47)', padding: '15px', borderRadius: '10px', marginTop: '15px', color: 'white' }}>
        <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>💡 Total Estimated Fertilizer Cost: ₹5,800 - ₹12,000 per acre</div>
        <div style={{ fontSize: '13px', opacity: 0.95 }}>
          Actual costs vary based on crop type, soil fertility, and local market prices. Government subsidies may reduce costs by 10-25%.
        </div>
      </div>
    </div>
  </div>
</div>

          {/* Selling Markets */}
<div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
  <h2 style={{ color: '#2d5016', marginBottom: '25px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #f57c00', paddingLeft: '20px' }}>
    🏪 Selling Markets & Channels
  </h2>
  <div style={{ background: '#fff9c4', padding: '28px', borderRadius: '15px', border: '3px solid #fff59d' }}>
    <p style={{ color: '#f57f17', lineHeight: '2', fontSize: '16px', margin: 0, fontWeight: '500', marginBottom: '20px' }}>
      {selectedCrop.selling}
    </p>
    
    <div style={{ borderTop: '2px dashed #fff59d', paddingTop: '20px', marginTop: '20px' }}>
      <h4 style={{ color: '#f57f17', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💰</span> Marketing Costs & Commission Breakdown
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#f57f17', marginBottom: '4px' }}>Transportation</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹500-2,000</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Per quintal, depends on distance</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#f57f17', marginBottom: '4px' }}>APMC Commission</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>1-2%</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Market fee on sale value</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#f57f17', marginBottom: '4px' }}>Loading/Unloading</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹50-150</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Per quintal labor charges</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: '#f57f17', marginBottom: '4px' }}>Packaging & Grading</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100' }}>₹100-500</div>
          <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>Bags, cleaning, sorting</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: '15px', borderRadius: '10px', marginTop: '15px', marginBottom: '15px' }}>
        <h5 style={{ color: '#f57f17', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span> Market Intelligence Tips
        </h5>
        <ul style={{ color: '#e65100', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Track Daily Prices:</strong> Use Agmarknet mobile app or call APMC for real-time rates before selling</li>
          <li><strong>Timing Matters:</strong> Avoid peak harvest season glut - store for 1-2 months if prices are low</li>
          <li><strong>Quality Premium:</strong> Clean, graded produce fetches 10-20% higher prices than mixed quality</li>
          <li><strong>Direct Marketing:</strong> Selling directly to processors/exporters saves 5-8% commission charges</li>
          <li><strong>Group Selling:</strong> Form FPOs (Farmer Producer Organizations) for better bargaining power</li>
        </ul>
      </div>

      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '2px solid #fff59d' }}>
        <h5 style={{ color: '#f57f17', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>📍 Best Selling Channels by Price</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '10px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
            <div style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '4px' }}>⭐ Best Price</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1b5e20' }}>Direct Export/Contract</div>
            <div style={{ fontSize: '11px', color: '#757575' }}>Premium quality only</div>
          </div>
          <div style={{ padding: '10px', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
            <div style={{ fontSize: '12px', color: '#ef6c00', marginBottom: '4px' }}>👍 Good Price</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e65100' }}>Processing Units/FPOs</div>
            <div style={{ fontSize: '11px', color: '#757575' }}>Bulk sales, assured payment</div>
          </div>
          <div style={{ padding: '10px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196f3' }}>
            <div style={{ fontSize: '12px', color: '#1976d2', marginBottom: '4px' }}>👌 Fair Price</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0d47a1' }}>APMC Mandis</div>
            <div style={{ fontSize: '11px', color: '#757575' }}>Quick sale, moderate price</div>
          </div>
          <div style={{ padding: '10px', background: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #f44336' }}>
            <div style={{ fontSize: '12px', color: '#c62828', marginBottom: '4px' }}>⚠️ Lower Price</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#b71c1c' }}>Local Middlemen</div>
            <div style={{ fontSize: '11px', color: '#757575' }}>Convenience vs price trade-off</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)', padding: '15px', borderRadius: '10px', marginTop: '15px', color: 'white' }}>
        <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>💡 Total Marketing Cost: 8-15% of Sale Value</div>
        <div style={{ fontSize: '13px', opacity: 0.95 }}>
          Includes transport, commission, labor, and packaging. Costs reduce significantly with direct sales or FPO membership. Plan logistics in advance to minimize expenses and maximize net returns.
        </div>
      </div>
    </div>
  </div>
</div>

          {/* Nutrient Requirements Radar Chart */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#2d5016', marginBottom: '25px', fontSize: '28px', fontWeight: 'bold' }}>🎯 Nutrient & Climate Requirements</h2>
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart data={[
                { subject: 'Nitrogen', value: selectedCrop.N, fullMark: 150 },
                { subject: 'Phosphorus', value: selectedCrop.P, fullMark: 150 },
                { subject: 'Potassium', value: selectedCrop.K, fullMark: 150 },
                { subject: 'Temperature', value: selectedCrop.temp, fullMark: 40 },
                { subject: 'Humidity', value: selectedCrop.hum, fullMark: 100 },
                { subject: 'pH', value: selectedCrop.ph * 10, fullMark: 100 }
              ]}>
                <PolarGrid stroke="#c8e6c9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#2d5016', fontSize: 14, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#757575' }} />
                <Radar name={selectedCrop.name} dataKey="value" stroke="#4a7c2c" fill="#4a7c2c" fillOpacity={0.6} strokeWidth={3} />
                <Tooltip contentStyle={{ background: 'white', border: '2px solid #4a7c2c', borderRadius: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Economics Analysis */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: '#2d5016', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>💰 Economics Analysis (Per Acre)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Revenue', value: parseInt(selectedCrop.revenue.replace(/[^\d]/g, '')) },
                        { name: 'Cost', value: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      dataKey="value"
                    >
                      <Cell fill="#4a7c2c" />
                      <Cell fill="#d32f2f" />
                    </Pie>
                    <Tooltip contentStyle={{ background: 'white', border: '2px solid #4a7c2c', borderRadius: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                <div style={{ background: '#e8f5e9', padding: '22px', borderRadius: '15px', border: '3px solid #c8e6c9' }}>
                  <div style={{ color: '#2e7d32', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Total Revenue</div>
                  <div style={{ color: '#1b5e20', fontSize: '34px', fontWeight: 'bold' }}>{selectedCrop.revenue}</div>
                </div>
                <div style={{ background: '#ffebee', padding: '22px', borderRadius: '15px', border: '3px solid #ffcdd2' }}>
                  <div style={{ color: '#c62828', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Total Cost</div>
                  <div style={{ color: '#b71c1c', fontSize: '34px', fontWeight: 'bold' }}>{selectedCrop.cost}</div>
                </div>
                <div style={{ background: '#e1f5fe', padding: '22px', borderRadius: '15px', border: '3px solid #b3e5fc' }}>
                  <div style={{ color: '#0277bd', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>Net Profit</div>
                  <div style={{ color: '#01579b', fontSize: '34px', fontWeight: 'bold' }}>{selectedCrop.profit}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Monthly Cost Breakdown Chart - NEW */}
<div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
  <h2 style={{ color: '#2d5016', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>📅 Monthly Cost Breakdown During Growing Period</h2>
  
  {/* Cost Chart */}
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={[
      { month: 'Month 1', cost: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.30, activity: 'Land prep + Seeds' },
      { month: 'Month 2', cost: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.15, activity: 'Fertilizers' },
      { month: 'Month 3', cost: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.15, activity: 'Irrigation + Labor' },
      { month: 'Month 4', cost: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.20, activity: 'Pest control' },
      { month: 'Month 5', cost: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.10, activity: 'Maintenance' },
      { month: 'Month 6', cost: parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.10, activity: 'Harvesting' }
    ]}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis dataKey="month" stroke="#616161" style={{ fontSize: '14px', fontWeight: '600' }} />
      <YAxis stroke="#616161" style={{ fontSize: '14px' }} label={{ value: 'Cost (₹)', angle: -90, position: 'insideLeft', style: { fontSize: '14px', fontWeight: 'bold' } }} />
      <Tooltip 
        contentStyle={{ background: 'white', border: '2px solid #4a7c2c', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        labelStyle={{ color: '#2d5016', fontWeight: 'bold', marginBottom: '8px' }}
        formatter={(value, name, props) => {
          return [
            `₹${value.toLocaleString('en-IN')}`,
            props.payload.activity
          ];
        }}
      />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      <Bar dataKey="cost" fill="#4a7c2c" radius={[8, 8, 0, 0]} name="Monthly Cost (₹)" />
    </BarChart>
  </ResponsiveContainer>

  {/* Cost Timeline Details */}
  <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
    <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '12px', border: '2px solid #c8e6c9' }}>
      <div style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '8px', fontWeight: '600' }}>🌱 Initial Phase (Month 1-2)</div>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1b5e20', marginBottom: '8px' }}>
        ₹{(parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.45).toLocaleString('en-IN')}
      </div>
      <div style={{ fontSize: '13px', color: '#757575', lineHeight: '1.6' }}>
        Land preparation, seeds/planting material, and basal fertilizers. Highest investment period.
      </div>
    </div>

    <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '12px', border: '2px solid #ffe0b2' }}>
      <div style={{ fontSize: '14px', color: '#ef6c00', marginBottom: '8px', fontWeight: '600' }}>💧 Growth Phase (Month 3-4)</div>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#e65100', marginBottom: '8px' }}>
        ₹{(parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.35).toLocaleString('en-IN')}
      </div>
      <div style={{ fontSize: '13px', color: '#757575', lineHeight: '1.6' }}>
        Regular irrigation, top-dressing fertilizers, weeding labor, and pest management sprays.
      </div>
    </div>

    <div style={{ background: '#e1f5fe', padding: '20px', borderRadius: '12px', border: '2px solid #b3e5fc' }}>
      <div style={{ fontSize: '14px', color: '#0277bd', marginBottom: '8px', fontWeight: '600' }}>🌾 Maturity Phase (Month 5-6)</div>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#01579b', marginBottom: '8px' }}>
        ₹{(parseInt(selectedCrop.cost.replace(/[^\d]/g, '')) * 0.20).toLocaleString('en-IN')}
      </div>
      <div style={{ fontSize: '13px', color: '#757575', lineHeight: '1.6' }}>
        Final irrigation, harvesting labor, threshing/processing, and transportation costs.
      </div>
    </div>
  </div>

  {/* Cash Flow Tips */}
  <div style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2c)', padding: '20px', borderRadius: '12px', marginTop: '20px', color: 'white' }}>
    <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>💡</span> Cash Flow Management Tips
    </h4>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px', lineHeight: '1.7' }}>
      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
        <strong>✓ Plan Financing:</strong> Arrange 50-60% of total cost before sowing through KCC loans or savings
      </div>
      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
        <strong>✓ Bulk Purchase:</strong> Buy seeds and fertilizers in advance during off-season for 10-15% discount
      </div>
      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
        <strong>✓ Labor Planning:</strong> Book harvest labor 15-20 days in advance to avoid peak season price surge
      </div>
      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
        <strong>✓ Insurance:</strong> Enroll in PM-Fasal Bima Yojana within cut-off dates to protect investment
      </div>
    </div>
  </div>
</div>

          {/* Video Resources */}
          {selectedCrop.images && selectedCrop.images.length > 2 && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <h2 style={{ color: '#2d5016', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #388e3c', paddingLeft: '20px' }}>
                🖼️ More Crop Images
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {selectedCrop.images.slice(2).map((img, i) => (
                  <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', boxShadow: '0 6px 20px rgba(0,0,0,0.10)' }}>
                    <img
                      src={img}
                      alt={`${selectedCrop.name} extra ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #c8e6c9, #a5d6a7)';
                        e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:80px">${selectedCrop.emoji}</div>`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedCrop.markets && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <h2 style={{ color: '#2d5016', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #1976d2', paddingLeft: '20px' }}>
                📊 Monthly Market Data Table
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', background: 'white' }}>
                  <thead>
                    <tr style={{ background: '#e8f5e9', color: '#2d5016', fontWeight: 'bold' }}>
                      <th style={{ padding: '12px', borderBottom: '2px solid #c8e6c9' }}>Month</th>
                      <th style={{ padding: '12px', borderBottom: '2px solid #c8e6c9' }}>Market Price</th>
                      <th style={{ padding: '12px', borderBottom: '2px solid #c8e6c9' }}>Demand Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCrop.markets.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#f9fbe7' : '#fff' }}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', fontWeight: '600' }}>{row.month}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', color: '#4a7c2c', fontWeight: 'bold' }}>{row.price}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e0e0e0', textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>{row.demand}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {selectedCrop.videos && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}>
              <h2 style={{ color: '#2d5016', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold', borderLeft: '6px solid #d32f2f', paddingLeft: '20px' }}>
                🎥 Educational Resources
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {selectedCrop.videos.map((video, i) => (
                  <a 
                    key={i} 
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2c)', padding: '30px', borderRadius: '16px', color: 'white', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 6px 20px rgba(45, 80, 22, 0.3)' }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(45, 80, 22, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 80, 22, 0.3)';
                      }}>
                      <div style={{ fontSize: '48px', marginBottom: '18px' }}>▶️</div>
                      <h4 style={{ marginBottom: '12px', fontSize: '19px', fontWeight: 'bold', lineHeight: '1.4' }}>{video.title}</h4>
                      <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>👁️ {video.views} views</div>
                      <div style={{ fontSize: '13px', opacity: 0.85, background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>
                        Click to watch on YouTube
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Success Factors */}
          <div style={{ background: 'linear-gradient(135deg, #2d5016, #4a7c2c)', borderRadius: '20px', padding: '45px', color: 'white', boxShadow: '0 10px 35px rgba(45, 80, 22, 0.4)' }}>
            <h2 style={{ marginBottom: '30px', fontSize: '30px', fontWeight: 'bold', textAlign: 'center' }}>✨ Key Success Factors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
              {[
                { icon: '🌱', title: 'Quality Seeds', desc: 'Use certified seeds from reputable sources for best germination and yields' },
                { icon: '💧', title: 'Water Management', desc: 'Proper irrigation at critical stages ensures optimal crop growth' },
                { icon: '🛡️', title: 'Pest Control', desc: 'Integrated pest management protects crops and environment' },
                { icon: '📅', title: 'Timely Sowing', desc: 'Planting at the right time maximizes yield potential' }
              ].map((factor, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '25px', borderRadius: '15px', border: '2px solid rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>{factor.icon}</div>
                  <h4 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{factor.title}</h4>
                  <p style={{ fontSize: '14px', opacity: 0.92, margin: 0, lineHeight: '1.6' }}>{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  // RENDER CURRENT VIEW
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      {currentView === 'home' && <HomePage />}
      {currentView === 'results' && <ResultsPage />}
      {currentView === 'browse' && <BrowsePage />}
      {currentView === 'detail' && <DetailPage />}
    </div>
  );
}

export default App;