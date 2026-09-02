'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { assetUrl } from '@/lib/constants';
import { branchCityLabel, branchDirectionsUrl, listBranches } from '@/lib/branches';
import type { BranchMapStyle } from './branch-map';

const BranchMap = dynamic(() => import('./branch-map'), {
  ssr: false,
  loading: () => (
    <div className="branch-map branch-map--loading d-flex align-items-center justify-content-center">
      <span className="fs-13 fc-secondary">Газрын зураг ачаалж байна...</span>
    </div>
  ),
});

type BranchLocatorProps = {
  selectedBranchId?: string | null;
  onSelectBranch?: (id: string) => void;
};

export default function BranchLocator({ selectedBranchId, onSelectBranch }: BranchLocatorProps = {}) {
  const branches = listBranches();
  const [selectedId, setSelectedId] = useState<string | null>(selectedBranchId || branches[0]?.id || null);
  const [mapStyle, setMapStyle] = useState<BranchMapStyle>('streets');

  useEffect(() => {
    if (selectedBranchId) setSelectedId(selectedBranchId);
  }, [selectedBranchId]);

  const pick = (id: string) => {
    setSelectedId(id);
    onSelectBranch?.(id);
  };

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="d-flex flex-column gap-3">
          {branches.map((branch) => {
            const active = branch.id === selectedId;
            return (
              <button
                key={branch.id}
                type="button"
                className={`branch-card text-start border rounded-4 overflow-hidden bg-white p-0${active ? ' branch-card--active' : ''}`}
                onClick={() => pick(branch.id)}
              >
                <div className="row g-0 align-items-stretch">
                  <div className="col-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assetUrl(branch.image)} alt="" className="w-100 h-100 ratio43 img-cover" />
                  </div>
                  <div className="col-8 p-3">
                    <strong className="d-block text-uppercase mb-1">{branch.name}</strong>
                    <span className="d-block fs-13 fc-secondary mb-1">{branchCityLabel(branch.city)}</span>
                    <span className="d-block fs-13 mb-1">{branch.address}</span>
                    <span className="d-block fs-12 fc-gray">{branch.hours}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="col-lg-7">
        <div className="branch-map-toolbar d-flex gap-2 mb-2">
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
        <div className="branch-map-shell rounded-4 overflow-hidden border">
          <BranchMap branches={branches} selectedId={selectedId} mapStyle={mapStyle} onSelect={pick} />
        </div>
        {selectedId ? (
          <div className="mt-3 d-flex flex-wrap gap-2">
            <a
              href={branchDirectionsUrl(branches.find((b) => b.id === selectedId)!)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-main rounded-3 px-4"
            >
              Google Maps-ээр зам заах
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
