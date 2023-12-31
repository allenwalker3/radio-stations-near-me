import { createContext, useState, ReactNode } from 'react';
import Station from '../../models/station';
import { uniqueId } from 'lodash';

import { Point } from 'react-native-google-places-autocomplete'

type Location = {
    lat: number,
    lng: number
}

type FilterContextType = {
    range: number,
    setRange: (val: number) => void,
    AM: boolean,
    setAM: (val: boolean) => void,
    FM: boolean,
    setFM: (val: boolean) => void,
    stations: Station[],
    setStations: (val: Array<Station>) => void,
    refresh: boolean,
    setRefresh: (val: boolean) => void,
    loading: boolean,
    setLoading: (val: boolean) => void,
    location: Location,
    setLocation: (point: Point) => void,
    useCustomLocation: boolean,
    setUseCustomLocation: (val: boolean) => void
}

export const FilterContext = createContext<FilterContextType>({
    range: 100,
    setRange: (_) => { },
    AM: true,
    setAM: (_) => { },
    FM: true,
    setFM: (_) => { },
    stations: [],
    setStations: ([]) => { },
    refresh: true,
    setRefresh: (_) => { },
    loading: false,
    setLoading: (_) => { },
    location: { lat: 0, lng: 0 },
    setLocation: (_) => { },
    useCustomLocation: false,
    setUseCustomLocation: (_) => { }
})

export const FilterContextProvider = ({ children }: { children: ReactNode }) => {
    const [range, setRange] = useState<number>(30);
    const [AM, setAM] = useState<boolean>(true);
    const [FM, setFM] = useState<boolean>(true);
    const [stations, setStations] = useState<Station[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<Point>({ lat: 0, lng: 0 });
    const [useCustomLocation, setUseCustomLocation] = useState<boolean>(false)
    const value = {
        range,
        setRange,
        AM, setAM,
        FM, setFM,
        stations, setStations, refresh, setRefresh, loading, setLoading,
        location, setLocation,
        useCustomLocation, setUseCustomLocation
    }
    return (
        <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
    )
}

export default FilterContextProvider;