"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Plus, Minus } from "lucide-react";
import type { Property } from "./property-card";

// Set Mapbox token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

interface PropertyMapProps {
  listings: Property[];
  center: { lat: number; lng: number };
  selectedId?: string;
  onMarkerClick?: (id: string) => void;
}

export function PropertyMap({
  listings,
  center,
  selectedId,
  onMarkerClick,
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredListing, setHoveredListing] = useState<Property | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox://styles/mapbox/dark-v11",
      center: [center.lng, center.lat],
      zoom: 12,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center.lat, center.lng]);

  // Add/update markers when listings change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers for each listing
    listings.forEach((listing) => {
      if (!listing.coordinates) return;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "property-marker";
      el.innerHTML = `
        <div class="marker-content ${selectedId === listing.id ? "selected" : ""}">
          $${listing.price.toLocaleString()}
        </div>
      `;

      // Add click handler
      el.addEventListener("click", () => {
        onMarkerClick?.(listing.id);
      });

      // Add hover handlers
      el.addEventListener("mouseenter", () => {
        setHoveredListing(listing);
        el.querySelector(".marker-content")?.classList.add("hovered");
      });

      el.addEventListener("mouseleave", () => {
        setHoveredListing(null);
        el.querySelector(".marker-content")?.classList.remove("hovered");
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
        .addTo(map.current!);

      markersRef.current[listing.id] = marker;
    });
  }, [listings, mapLoaded, selectedId, onMarkerClick]);

  // Update selected marker style
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const content = el.querySelector(".marker-content");
      if (content) {
        if (id === selectedId) {
          content.classList.add("selected");
        } else {
          content.classList.remove("selected");
        }
      }
    });
  }, [selectedId]);

  const handleZoomIn = useCallback(() => {
    map.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    map.current?.zoomOut();
  }, []);

  const handleRecenter = useCallback(() => {
    map.current?.flyTo({ center: [center.lng, center.lat], zoom: 12 });
  }, [center]);

  // Show fallback if no Mapbox token
  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-sky-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Map View</h3>
          <p className="text-slate-400 text-sm mb-4">
            {listings.length} properties in this area
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {listings.slice(0, 5).map((listing) => (
              <div
                key={listing.id}
                className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-sm text-white border border-slate-600"
              >
                ${listing.price.toLocaleString()}/mo
              </div>
            ))}
            {listings.length > 5 && (
              <div className="px-3 py-1.5 bg-sky-500/20 rounded-lg text-sm text-sky-400 border border-sky-500/30">
                +{listings.length - 5} more
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Marker Styles - Dark Map Theme */}
      <style jsx global>{`
        .property-marker {
          cursor: pointer;
        }
        .marker-content {
          background: rgba(15, 23, 42, 0.9);
          color: #f8fafc;
          padding: 6px 10px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .marker-content:hover,
        .marker-content.hovered {
          background: #0ea5e9;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.5), 0 0 0 1px rgba(14, 165, 233, 0.8);
          border-color: transparent;
        }
        .marker-content.selected {
          background: #0ea5e9;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.5), 0 0 0 1px rgba(14, 165, 233, 0.8);
          border-color: transparent;
        }
        .mapboxgl-ctrl-attrib {
          background: rgba(15, 23, 42, 0.8) !important;
          color: rgba(148, 163, 184, 0.8) !important;
          backdrop-filter: blur(4px);
          border-radius: 4px;
          padding: 2px 6px !important;
        }
        .mapboxgl-ctrl-attrib a {
          color: rgba(148, 163, 184, 0.8) !important;
        }
      `}</style>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Loading map...</span>
          </div>
        </div>
      )}

      {/* Hovered Listing Popup */}
      {hoveredListing && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-30">
          <Card variant="glass" className="p-0 overflow-hidden bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-xl">
            <div className="flex">
              <div className="relative w-24 h-24 shrink-0">
                <Image
                  src={hoveredListing.image}
                  alt={hoveredListing.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                  loading="lazy"
                />
              </div>
              <div className="p-3 flex-1">
                <div className="font-bold text-white">
                  ${hoveredListing.price.toLocaleString()}/mo
                </div>
                <div className="text-sm text-slate-200 line-clamp-1">
                  {hoveredListing.title}
                </div>
                <div className="text-xs text-slate-400 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1 text-sky-400" />
                  {hoveredListing.neighborhood}
                </div>
                <div className="flex gap-2 mt-2 text-xs text-slate-400">
                  <span>{hoveredListing.beds} bd</span>
                  <span>|</span>
                  <span>{hoveredListing.baths} ba</span>
                  <span>|</span>
                  <span>{hoveredListing.sqft} sqft</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="w-10 h-10 bg-slate-800/90 backdrop-blur-md border border-slate-700 shadow-lg rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
          title="Recenter map"
        >
          <Navigation className="h-5 w-5 text-slate-300" />
        </button>
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-slate-800/90 backdrop-blur-md border border-slate-700 shadow-lg rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
          title="Zoom in"
        >
          <Plus className="h-5 w-5 text-slate-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-slate-800/90 backdrop-blur-md border border-slate-700 shadow-lg rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
          title="Zoom out"
        >
          <Minus className="h-5 w-5 text-slate-300" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 hidden md:block">
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 shadow-lg px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <div className="w-3 h-3 rounded-full bg-sky-500" />
            <span>{listings.length} properties</span>
          </div>
        </div>
      </div>
    </div>
  );
}
