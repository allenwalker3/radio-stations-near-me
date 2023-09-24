
type StationProps = {
  
}

class Station {
    id : number; 
    callSign: string; 
    frequency: string; 
    service: string;
    directional: string;
    hoursOperation: string;
    city: string;
    state: string;
    country: string;
    fileNumber: string;
    power: string;
    facilityId: string;
    geom: {lat: string, lng: string};
    licensee: string;
    applicationId: string; 
    distance: number;
    format: string;
    constructor(id: number, 
        callSign: string, 
        frequency: string, 
        service: string,
        directional: string,
        hoursOperation: string,
        city: string,
        state: string,
        country: string,
        fileNumber: string,
        power: string,
        facilityId: string,
        geom: {lat: string, lng: string},
        licensee: string,
        applicationId: string, 
        distance: number, 
        format: string) {
        this.id=id; 
        this.callSign=callSign; 
        this.frequency=frequency;
        this.service=service;
        this.directional=directional;
        this.hoursOperation=hoursOperation;
        this.city=city;
        this.state=state
        this.country=country;
        this.fileNumber=fileNumber;
        this.power=power;
        this.facilityId=facilityId;
        this.geom=geom;
        this.licensee=licensee;
        this.applicationId=applicationId;
        this.distance=distance; 
        this.format=format;
    }

    toFlatListItem() {
       // const callSign = this.callSign.match(/^[^-]*/)[0];
        const callSign = this.callSign;
        const frequency = this.frequency;
        const distance = this.distance;
        return { id: this.id, callSign: callSign, 
            frequency: frequency, 
            distance: distance.toFixed(1), format: this.format, service: this.service }
    }
}

export default Station;