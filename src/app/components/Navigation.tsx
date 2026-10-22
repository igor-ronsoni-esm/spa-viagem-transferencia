/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Truck, MapPin, ClipboardList, Settings, User } from "lucide-react";
import { cn } from "../../lib/utils";

export function Navigation() {
  return (
    <nav className="fixed left-0 top-0 h-full w-16 bg-primary flex flex-col items-center py-4 gap-6 text-white/70">
      <div className="p-2 bg-white/10 rounded-xl mb-2">
        <Truck className="w-6 h-6 text-white" />
      </div>

      <button
        className="nav-item active text-white cursor-pointer"
        title="Viagens"
      >
        <ClipboardList className="w-5 h-5" />
      </button>

      <button className="nav-item cursor-pointer" title="Agências">
        <MapPin className="w-5 h-5" />
      </button>

      <button className="nav-item cursor-pointer" title="Motoristas">
        <User className="w-5 h-5" />
      </button>

      <div className="mt-auto flex flex-col gap-4 mb-4">
        <button className="nav-item cursor-pointer" title="Configurações">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
