import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ListaPersonas from './pages/personas/ListaPersonas.jsx';
import FormPersona from './pages/personas/FormPersona.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import FotoPersona from './pages/personas/FotoPersona.jsx';
import ListaUsuarios from './pages/usuarios/ListaUsuarios.jsx';
import FormUsuario from './pages/usuarios/FormUsuario.jsx';
import FormLogin from './pages/auth/FormLogin.jsx';
import FormRegister from './pages/auth/FormRegister.jsx';
import EjemploMapa from './pages/EjemploMapa.jsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import ListaCarretera from './pages/carreteras/ListaCarretera.jsx';
import ListaMunicipios from './pages/municipios/ListaMunicipios.jsx';
import FormMunicipio from './pages/municipios/FormMunicipio.jsx';
import ListaIncidentes from './pages/incidentes/ListaIncidente.jsx';
import FormCarretera from './pages/carreteras/FormCarretera.jsx';
import FormIncidente from './pages/incidentes/FormIncidente.jsx';
import FotoIncidente from './pages/incidentes/FotoIncidente.jsx';
import ListaRuta from './pages/rutas/ListaRuta.jsx';
import FormRuta from './pages/rutas/FormRuta.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <EjemploMapa />,
  },
  {
    path: "/login",
    element: <FormLogin />,
  },
  {
    path: "/register",
    element: <FormRegister />,
  },
  {
    path: '/helloworld',
    element: <App />
  },
  {
    path: "/personas",
    element: <ListaPersonas />
  },
  {
    path: "/personas/create",
    element: <FormPersona />
  },
  {
    path: "/personas/:id",
    element: <FormPersona />
  },
  {
    path: '/personas/:id/foto',
    element: <FotoPersona />
  },
  {
    path: "/usuarios",
    element: <ListaUsuarios />
  },
  {
    path: "/usuarios/create",
    element: <FormUsuario />
  },
  {
    path: "/usuarios/:id",
    element: <FormUsuario />
  },
  {
    path: "/mapa",
    element: <EjemploMapa />
  },
  {
    path: "/carreteras",
    element: <ListaCarretera />
  },
  {
    path: "/carreteras/create",
    element: <FormCarretera />
  },
  {
    path: "/carreteras/:id",
    element: <FormCarretera />
  },
  {
    path: "/municipios",
    element: <ListaMunicipios />
  },
  {
    path: "/municipios/create",
    element: <FormMunicipio />
  },
  {
    path: "/municipios/:id",
    element: <FormMunicipio />
  },
  {
    path: "/incidentes",
    element: <ListaIncidentes />
  },
  {
    path: "/incidentes/create",
    element: <FormIncidente />
  },
  {
    path: "/incidentes/:id",
    element: <FormIncidente />
  },
  {
    path: "/incidentes/:id/foto",
    element: <FotoIncidente />
  },
  {
    path: "/rutas",
    element: <ListaRuta />
  },
  {
    path: "/rutas/create",
    element: <FormRuta />
  },
  {
    path: "/rutas/:id",
    element: <FormRuta />
  }
]);
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
console.log('Tu api key de google maps: ', API_KEY);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={API_KEY}>

      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>,
)
