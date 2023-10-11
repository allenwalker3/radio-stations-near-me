
const server = require('./app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);

describe("BE Endpoints", () => {
    it("Test GET / stations in Denver, 45 mile radius", async () => {
        const distance = 45;
        // denver co
        const loc_x = 39.7363;
        const loc_y = -105.0694;
        const resp = await requestWithSupertest
            .get(`/?distance=${distance}&am=true&fm=true&loc_y=${loc_y}&loc_x=${loc_x}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(resp.res.text).toContain('KNUS');
        expect(resp.res.text).not.toContain('KVOR');
    })
    it("Test GET / stations in Denver, 90 mile radius", async () => {
        const distance = 90;
        // denver co
        const loc_x = 39.7363;
        const loc_y = -105.0694;
        const resp = await requestWithSupertest
            .get(`/?distance=${distance}&am=true&fm=true&loc_y=${loc_y}&loc_x=${loc_x}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(resp.res.text).toContain('KNUS'); // 19.1 mi
        expect(resp.res.text).toContain('KVBV'); //  86.2 mi
        expect(resp.res.text).not.toContain('KWRP'); // 102.0 mi
    })

    it("Test PUT /:callSign/:service", async () => {
        const callSign = 'KNUS';
        const service = 'AM';
        await requestWithSupertest.put('/KNUS/AM').send({format: 'Oldies'}).expect(200);
        // bad format
        await requestWithSupertest.put('/KNUS/AM').send({format: 'Foobar'}).expect(404);
        // bad callsign
        await requestWithSupertest.put('/KNUSKNUS/AM').send({format: 'Oldies'}).expect(404);
    })
})