
const server = require('./app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);

describe("Endpoints", () => {
    it("GET / stations in Denver, 45 mile radius", async () => {
        const distance = 45;
        // denver co
        const loc_x = 39.7363; 
        const loc_y = -105.0694;
        const resp = await requestWithSupertest
            .get(`/?distance=${distance}&am=true&fm=true&loc_y=${loc_y}&loc_x=${loc_x}`); 
        expect(resp.status).toEqual(200);
        expect(resp.type).toEqual(expect.stringContaining('json'));
        expect(resp.res.text).toContain('KNUS')
        expect(resp.res.text).not.toContain('KVOR')
    })
    it("GET / stations in Denver, 90 mile radius", async () => {
        const distance = 90;
        // denver co
        const loc_x = 39.7363; 
        const loc_y = -105.0694;
        const resp = await requestWithSupertest
            .get(`/?distance=${distance}&am=true&fm=true&loc_y=${loc_y}&loc_x=${loc_x}`); 
        expect(resp.status).toEqual(200);
        expect(resp.type).toEqual(expect.stringContaining('json'));
        expect(resp.res.text).toContain('KNUS'); // 19.1 mi
        expect(resp.res.text).toContain('KVBV'); //  86.2 mi
        expect(resp.res.text).not.toContain('KWRP'); // 102.0 mi
    })
})