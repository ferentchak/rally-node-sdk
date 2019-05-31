import _ = require('lodash');
import * as Toolkit from './index';

export class Common {

    client: Toolkit.Client

    constructor(client: Toolkit.Client) {
        this.client = client;
    }

    /**
     * 
     * @param allRoots The list of root projects that the child projects will be returned from
     * @param  fetch The list of fields you want fetched on the children. The children field will be added to the user selection
     */
    async getAllChildProjects(
        allRoots: Toolkit.Api.RallyObject[],
        fetch: string[] = ['Name', 'Workspace'],
        onEachPageComplete = (onePage) => []
    ) {
        const requiredFetchFields = _.uniq(["Children", ...fetch])
        if (!allRoots.length) {
            return [];
        }
        const allClosed = allRoots
            .filter(r => {
                if (!r.Children) {
                    return true;
                }
                return !!r.Children.Count;
            });
        let children = [];
        while (allClosed.length) {
            const project = allClosed.pop();
            let result = [];
            try {
                result = await this.client.getCollection(project, 'Children', { fetch: requiredFetchFields });
            }
            catch (err) {
                result = await this.client.getCollection(project, 'Children', { fetch: requiredFetchFields });
            }
            children = _.flatten([...children, ...result]);
            onEachPageComplete(children);
        }

        const decendents = await this.getAllChildProjects(children, fetch, onEachPageComplete);
        let finalResponse = _.flatten([...decendents, ...allRoots, ...children]);

        const removeDupes = {};
        finalResponse.forEach((s) => { removeDupes[s['_ref']] = s; });
        finalResponse = Object.values(removeDupes);
        return finalResponse;
    }
}
