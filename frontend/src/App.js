import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import { Dialog, Transition } from "@headlessui/react";

import Pins from "./Pins";
import CATEGORY_COLOR_MAP from "./constants";
import dcbLogo from "./images/dcbLogo.png";

import "./App.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const API_URL = process.env.REACT_APP_API_URL;

const LOCATIONS_ENDPOINT = `${API_URL}/api/locations/`;
const CATEGORIES_ENDPOINT = `${API_URL}/api/categories/`;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
}

function Routes() {
  const { isLoading, error, data } = useQuery("categories", () =>
    fetch(CATEGORIES_ENDPOINT).then((res) => res.json())
  );
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <Router>
      <div>
        <div className="bg-red-500 h-8"></div>

        <div className="px-5 md:px-40 py-5 md:py-10">
          <div className="flex flex-wrap gap-4 pb-6 justify-left items-center">
            <Link to="/">
              <h1 className="font-bold text-2xl w-full md:w-max uppercase">
                Harta românilor <br /> în Berlin
              </h1>
            </Link>
            <h3 className="text-lg text-right leading-none">un proiect</h3>
            <img className="h-12 md:h-16" src={dcbLogo} />
          </div>
          <Switch>
            {data.map((category) => (
              <Route path={`/${category.name_slug}`}>
                <CategoryDetail category={category} />
              </Route>
            ))}
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  const { isLoading, error, data } = useQuery("categories", () =>
    fetch(CATEGORIES_ENDPOINT).then((res) => res.json())
  );
  if (!data) return null;

  return (
    <div>
      <div className="grid md:grid-rows-4 grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-200 row-span-2 col-span-2 md:col-span-4 lg:col-span-3 relative border-t-4 border-red-500">
          <ModalMap />
        </div>
        {data.map((category) => (
          <Link
            to={`/${category.name_slug}`}
            className="flex p-5 bg-gray-200 hover:bg-gray-300 items-center justify-center border-t-4 hover:border-black cursor-pointer text-gray-500 hover:text-black transition-all"
          >
            <button
              key={category.pk}
              className="font-body font-bold text-center uppercase text-md md:text-xl"
            >
              {category?.label_plural}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategoryDetail({ category }) {
  const { isLoading, error, data } = useQuery("locations", () =>
    fetch(`${LOCATIONS_ENDPOINT}?category=${category?.pk}`).then((res) =>
      res.json()
    )
  );
  if (!data) return null;
  return (
    <div>
      <div>
        <h1 className="font-bold text-2xl text-red-500 w-full md:w-max uppercase">
          {category.label_plural}
        </h1>
      </div>

      <div className="grid md:grid-rows-4 grid-cols-1 gap-4">
        <div className="bg-red-200 row-span-2 col-span-1 relative border-t-4 border-red-500">
          <Map
            locations={data}
            onClick={(location) => console.log({ location })}
          />
        </div>
        {data.features.map((location) => (
          <button
            key={location.properties.pk}
            className="flex p-5 bg-gray-200 hover:bg-gray-300 items-center justify-center border-t-4 hover:border-black cursor-pointer text-gray-500 hover:text-black font-body font-bold text-center uppercase text-md md:text-xl transition-all"
          >
            {location.properties.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Map({ locations, onClick }) {
  const [viewport, setViewport] = React.useState({
    latitude: 52.520008,
    longitude: 13.404954,
    zoom: 11.3,
  });

  const geojson = locations || {};

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="50vh"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Pins
          data={geojson.features}
          onClick={(feature) => onClick(feature.properties)}
        />
      </Source>
    </ReactMapGL>
  );
}

function ModalMap() {
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [viewport, setViewport] = React.useState({
    latitude: 52.520008,
    longitude: 13.404954,
    zoom: 11.3,
  });

  const { isLoading, error, data } = useQuery("locations", () =>
    fetch(LOCATIONS_ENDPOINT).then((res) => res.json())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  const geojson = data || {};

  function closeModal() {
    setSelectedLocation(null);
  }

  return (
    <>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="50vh"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <Source id="my-data" type="geojson" data={geojson}>
          <Pins
            data={geojson.features}
            onClick={(feature) => setSelectedLocation(feature.properties)}
          />
        </Source>
      </ReactMapGL>

      <Transition appear show={!!selectedLocation} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
          open={!!selectedLocation}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xl p-6 my-0 md:my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold font-medium leading-6 text-gray-900"
                >
                  <div className="flex cols-2 justify-between">
                    <div>
                      <span
                        className={`font-semibold text-sm uppercase text-${
                          CATEGORY_COLOR_MAP[selectedLocation?.category?.pk]
                        }-400`}
                      >
                        {selectedLocation?.category?.label_singular}
                      </span>
                      <div>{selectedLocation?.name}</div>
                    </div>
                    <div className="flex">
                      <button
                        type="button"
                        className="justify-center h-8 w-8 text-lg font-bold text-gray-600 bg-gray-100 border border-transparent rounded-3xl hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={closeModal}
                      >
                        x
                      </button>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {selectedLocation?.description}
                  </p>
                </div>

                <div className="mt-4">
                  <div>{selectedLocation?.address}</div>
                  <div>{selectedLocation?.description}</div>
                  <div>{selectedLocation?.email}</div>
                  <div>{selectedLocation?.website}</div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default App;
