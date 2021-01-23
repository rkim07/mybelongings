import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';

@Service()
export class SwaggerService {
    private spec: any;

    constructor() {
        const spath: string = path.resolve('./spec.json');
        const file: string = fs.readFileSync(spath, 'utf8');
        this.spec = JSON.parse(file);
    }

    public getSwaggerSpec(): any {
        return this.spec;
    }
}
