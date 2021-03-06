import apiKey = require('./apikey.conf');
import fs = require('fs');
import _ = require('lodash');
import * as Toolkit from '../index';

const client = new Toolkit.ClassClients.TypeDefinition(apiKey,{});

const doIt = async () => {
    let typedefs = (await client.query('typedefinition', { fetch: true, pagesize: 2000 }))
        .map(r => r);

    let mappedtypes = {};
    const mapType = (type: Toolkit.Classes.TypeDefinition) => {
        mappedtypes[type.ElementName] = type;
    };
    typedefs.forEach(mapType);
    const indexParent = async (type) => {
        const parent = await client.get(type.Parent._ref);
        type.Parent = parent;
        mapType(parent);
        if (parent.Parent) {
            return indexParent(parent);
        }
    };
    const parentPromises = typedefs
        .filter(t => t.Parent)
        .map(indexParent);
    const results = await Promise.all(parentPromises);
    typedefs = _.keys(mappedtypes).sort()
        .map(k => mappedtypes[k]);
    const attributeRequests = typedefs.map(r => client.getCollection(r, 'Attributes', { pagesize: 2000, fetch: true, order: 'Name' }));
    const finished = await Promise.all(attributeRequests);

    typedefs.forEach((t: Toolkit.Classes.TypeDefinition) => {
        t.Attributes = t.Attributes.filter(a => !a.Custom);
        t.Attributes = t.Attributes.filter(a => a.TypeDefinition._refObjectName === t._refObjectName);
    });

    fs.writeFileSync(
        'Classes.ts',
        GenerateClassFiles.getModule(typedefs)
    );

    fs.writeFileSync(
        'ClassClients.ts',
        GenerateClassClients.getModule(typedefs)
    );
};

class GenerateClassFiles {
    static getModule(types: any[]) {
        return `
    //This file is generated by the build process
    import * as Toolkit from './index';
    export namespace Classes{
    ${types.map(GenerateClassFiles.getClass).join(' ')}
    }`;
}
    static getClass(type: Toolkit.Classes.TypeDefinition) {
        const parent = type.Parent ? type.Parent.ElementName : 'Toolkit.Api.RallyObject';

        const template = `
        /**
         * ${type.Name}
         * ${type.Note}
         * 
         */
        export interface ${type.ElementName} extends ${parent} {
            ${type.Attributes.map(a => ` ${GenerateClassFiles.getAttribute(a)}`).join(' ')}
        } `;

        return template;
    }
    static getAttribute(attr: Toolkit.Classes.AttributeDefinition) {
        const map = {
            integer: 'number',
            date: 'Date',
            raw: 'string',
            decimal: 'number',
            object: 'object',
            string: 'string',
            collection: 'any[]',
            text: 'string',
            boolean: 'boolean',
            state: 'string',
            rating: 'string',
            quantity: 'number',
            map: 'string',
            binary_data: 'string'
        };
        const mapAttributeType = (s: string) => {
            s = s.toLowerCase();
            let type = map[s];
            if (type === 'object') {
                type = attr.AllowedValueType._refObjectName.replace(/\s/g, '');
                if (type === 'PanelDefinition') {
                    type = '{[x:string]:any} //not in meta data on rally side';
                }
            }
            if (s === 'collection') {
                type = `${attr.AllowedValueType._refObjectName.replace(/\s/g, '')}[]`;
            }
            if (!type) throw new Error(`Missing type ${s}on attribute ${attr.ElementName}`);
            return type;
        };
        return `
        /**
         * ${attr.Name}
         * ${attr.Note}
         */
        ${attr.ElementName}? : ${mapAttributeType(attr.AttributeType)}
    `;
    }
}

class GenerateClassClients {
    static getModule(types: any[]) {
        return `
    //This file is generated by the build process
    ${ClassClientTemplate}

    ${types.map(GenerateClassClients.getClass).join(' ')}
    }`;
}
    static getClass(type: Toolkit.Classes.TypeDefinition) {
        const template = `
    export class ${type.ElementName} extends ClassClientBase<Classes.${type.ElementName}> {
        constructor(apiKey: string, options: Api.ClientOptions)
        constructor(client: Client)
        constructor(...params: any[]) {
            const client = _.isObject(params[0])?params[0]:new Client(params[0],params[1]);
            super("${type.ElementName}",client);                
        }
    }
        `;

        return template;
    }
}

doIt()
    .then(console.log)
    .catch(console.error);

const ClassClientTemplate = `
import { Client, Api, Classes } from './index';
import _ = require('lodash');

export namespace ClassClients {
    export class ClassClientBase<T extends Api.RallyObject> {
        constructor(typeName: string, apiKey: string, options: Api.ClientOptions)
        constructor(typeName: string,client: Client)
        constructor(typeName: string, ...params: any[]) {
            this.typeName = typeName;            
            if(_.isObject(params[0])){
                this.client = params[0];
            }
            else{
                this.client = new Client(params[0],params[1]);
            }
        }
        /**
         * @private
         */
        client: Client
        /**
         * @private
         */
        typeName: string
        /**
         * returns an array modified to have additional meta data on it containing the results
         */
        async query(type, query: Api.QueryOptions = {}, params = {}):
            Promise<Api.QueryResponse<T>> {
            let resp: any = this.client.query(this.typeName, query, params);
            return resp;
        }

        /**
         * Saves the current state of the Rally object to Rally.
         * Creating a new object on the server if no _ref is provided in rallyObject
         * @param rallyObject A new or existing Rally object
         */
        async save(rallyObject: Partial<T>): Promise<T>
        async save(
            rallyObject: Partial<T>,
            queryOptions: Api.QueryOptions = {}
        ): Promise<T> {
            let resp: any =  this.client.save(rallyObject, queryOptions);
            return resp;
        }

        /**
         * Returns a Rally object by ref or by type and ID
         */
        async get(typeOrRef: string, objectID = 0, params: Api.QueryOptions = {}): Promise<T> {
            let resp: any = this.client.get(typeOrRef, objectID, params);
            return resp;
        }

        /**
         * Gets a subcollection stored on the Rally object
         */
        async getCollection(rallyObject: T, collectionName: string, params: Api.QueryOptions = {}): Promise<Api.QueryResponse<Api.RallyObject>> {
            let resp: any = this.client.getCollection(rallyObject, collectionName, params);
            return resp;
        }

        /**
         * 
         * @param  inputOrRef Either a Rally object or the ref for a Rally object
         * @param  params Optional Params to be sent with the request
         * @param  ignoreDelay Pass true if you don't want to wait 500 ms longer to return. This time gives the Rally server a chance to finish deleting
         */
        async delete(inputOrRef: string | Api.RallyObject, params = {}, ignoreDelay = false) {
            return this.client.delete(inputOrRef, params, ignoreDelay);
        }
    }
`;
