import { createContext, ReactNode, useContext, useState } from "react";
import { getSolution } from "../../data/data";
import { MapMarkerData, Solution } from "../../data/DataTypes";
import { useGameMarkers } from "./GameMarkersContext";

interface LocalGameDataContextProps {
   selectedSolutionID: string | null;
   setSelectedSolutionID: (id: string | null) => void;
   getSelectedSolution: () => Solution | undefined;
   selectedMarkerID: number | null;
   setSelectedMarkerID: (id: number | null) => void;
   getSelectedMarker: () => MapMarkerData | undefined;
   selectedPlayerID: string | null;
   setSelectedPlayerID: (id: string | null) => void;
}

const LocalGameDataContext = createContext<LocalGameDataContextProps | undefined>(undefined);

export const LocalGameDataProvider = ({ children }: { children: ReactNode }) => {
   const { markers } = useGameMarkers();
   const [selectedSolutionID, setSelectedSolutionID] = useState<string | null>(null);
   const [selectedMarkerID, setSelectedMarkerID] = useState<number | null>(null);
   const [selectedPlayerID, setSelectedPlayerID] = useState<string | null>(null);

   const getSelectedSolution = () => {
      return getSolution(selectedSolutionID);
   };

   const getSelectedMarker = () => {
      return selectedMarkerID === null ? undefined : markers.find((mar) => mar.id === selectedMarkerID);
   };

   return (
      <LocalGameDataContext.Provider
         value={{
            selectedSolutionID,
            setSelectedSolutionID,
            getSelectedSolution,
            selectedMarkerID,
            setSelectedMarkerID,
            getSelectedMarker,
            selectedPlayerID,
            setSelectedPlayerID,
         }}
      >
         {children}
      </LocalGameDataContext.Provider>
   );
};

export const useLocalGameData = () => {
   const context = useContext(LocalGameDataContext);
   if (!context) {
      throw new Error("useLocalGameData must be used within a LocalGameDataContextProvider");
   }
   return context;
};
