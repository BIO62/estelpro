'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { branchDirectionsUrl, listBranches } from '@/lib/branches';
import type { BranchMapStyle } from './branch-map';

const BranchMap = dynamic(() => import('./branch-map'), {
  ssr: false,
  loading: () => (
    <div className="branch-map branch-map--loading branch-map-shell--hero d-flex align-items-center justify-content-center">
      <span className="fs-13 fc-secondary">Газрын зураг ачаалж байна...</span>
    </div>
  ),
});

type BranchMapPanelProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function BranchMapPanel({ selectedId, onSelect }: BranchMapPanelProps) {
  const branches = listBranches();
  const [mapStyle, setMapStyle] = useState<BranchMapStyle>('satellite');
  const selected = branches.find((branch) => branch.id === selectedId);

  return (
    <div className="pt-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="branch-map-toolbar d-flex gap-2">
          <button
            type="button"
            className={`branch-map-toolbar__btn${mapStyle === 'streets' ? ' is-active' : ''}`}
            onClick={() => setMapStyle('streets')}
          >
            Газрын зураг
          </button>
          <button
            type="button"
            className={`branch-map-toolbar__btn${mapStyle === 'satellite' ? ' is-active' : ''}`}
            onClick={() => setMapStyle('satellite')}
          >
            Хиймэл дагуул
          </button>
        </div>
        {selected ? (
          <a
            href={branchDirectionsUrl(selected)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-main btn-sm rounded-3 px-3"
          >
            Зам заах — {selected.name}
          </a>
        ) : null}
      </div>
      <div className="branch-map-shell branch-map-shell--hero rounded-4 overflow-hidden border">
        <BranchMap
          branches={branches}
          selectedId={selectedId}
          mapStyle={mapStyle}
          fitAll
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
