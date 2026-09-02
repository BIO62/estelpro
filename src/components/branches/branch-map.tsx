'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { assetUrl } from '@/lib/constants';
import { branchCityLabel, branchDirectionsUrl, type Branch } from '@/lib/branches';

export type BranchMapStyle = 'streets' | 'satellite';

const DEFAULT_CENTER: [number, number] = [47.918, 106.917];
const POPUP_MIN_WIDTH = 240;
const POPUP_MAX_WIDTH = 300;
const POPUP_OPEN_DELAY_MS = 480;

const MAP_TILES = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18,
  },
} as const;

function markerIcon(active: boolean) {
  return L.divIcon({
    className: 'branch-map-marker',
    html: `<span class="branch-map-marker__dot${active ? ' branch-map-marker__dot--active' : ''}"></span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function MapFocus({ branch }: { branch: Branch | null }) {
  const map = useMap();

  useEffect(() => {
    if (!branch) return;
    map.flyTo([branch.lat, branch.lng], 16, { duration: 0.45 });
  }, [branch, map]);

  return null;
}

function MapBounds({ branches, fitAll }: { branches: Branch[]; fitAll?: boolean }) {
  const map = useMap();

  useEffect(() => {
    const target = fitAll
      ? branches
      : branches.filter((branch) => branch.city === 'ulaanbaatar').length
        ? branches.filter((branch) => branch.city === 'ulaanbaatar')
        : branches;
    if (target.length < 2) return;
    const bounds = L.latLngBounds(target.map((branch) => [branch.lat, branch.lng]));
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: fitAll ? 11 : 13 });
  }, [branches, fitAll, map]);

  return null;
}

function BranchMarker({
  branch,
  active,
  onSelect,
}: {
  branch: Branch;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return undefined;

    if (!active) {
      marker.closePopup();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      marker.openPopup();
    }, POPUP_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <Marker
      ref={markerRef}
      position={[branch.lat, branch.lng]}
      icon={markerIcon(active)}
      eventHandlers={{
        click: () => onSelect(branch.id),
      }}
    >
      <Popup
        className="branch-map-popup-wrap"
        minWidth={POPUP_MIN_WIDTH}
        maxWidth={POPUP_MAX_WIDTH}
        autoClose={false}
        closeOnClick={false}
      >
        <div className="branch-map-popup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(branch.image)} alt="" className="branch-map-popup__image" />
          <span className="branch-map-popup__city">{branchCityLabel(branch.city)}</span>
          <strong className="branch-map-popup__title">{branch.name}</strong>
          <p className="branch-map-popup__address">{branch.address}</p>
          <p className="branch-map-popup__hours">{branch.hours}</p>
          <a
            href={branchDirectionsUrl(branch)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-main rounded-3 w-100"
          >
            Зам заах
          </a>
        </div>
      </Popup>
    </Marker>
  );
}

type BranchMapProps = {
  branches: Branch[];
  selectedId: string | null;
  mapStyle: BranchMapStyle;
  fitAll?: boolean;
  onSelect: (id: string) => void;
};

export default function BranchMap({ branches, selectedId, mapStyle, fitAll, onSelect }: BranchMapProps) {
  const selected = branches.find((branch) => branch.id === selectedId) || null;
  const tiles = MAP_TILES[mapStyle];

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={12}
      minZoom={5}
      maxZoom={tiles.maxZoom}
      scrollWheelZoom
      className="branch-map"
      style={{ height: '100%', width: '100%' }}
    >
      {mapStyle === 'streets' ? (
        <TileLayer
          key="streets"
          attribution={tiles.attribution}
          url={tiles.url}
          subdomains="abc"
          maxZoom={tiles.maxZoom}
        />
      ) : (
        <TileLayer
          key="satellite"
          attribution={tiles.attribution}
          url={tiles.url}
          maxZoom={tiles.maxZoom}
          maxNativeZoom={tiles.maxZoom}
        />
      )}
      <MapBounds branches={branches} fitAll={fitAll} />
      <MapFocus branch={selected} />
      {branches.map((branch) => (
        <BranchMarker
          key={branch.id}
          branch={branch}
          active={branch.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  );
}
