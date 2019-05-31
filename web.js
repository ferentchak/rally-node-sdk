var CustomAgile=function(e){var t={};function s(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=e,s.c=t,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=1)}([function(e,t){e.exports=_},function(e,t,s){"use strict";function r(e){for(var s in e)t.hasOwnProperty(s)||(t[s]=e[s])}Object.defineProperty(t,"__esModule",{value:!0}),r(s(3)),r(s(6)),r(s(2))},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(0),n="[0-9]+|-?[0-9]+|[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}|[a-fA-F0-9]{32}",c=`(${n})`,i=`(?:${n})`,o="(?:\\.js\\??.*)",a=[new RegExp(`.*?\\/(\\w{2,}\\/\\w+)\\/${c}\\/(\\w+)${o}?$`),new RegExp(`.*?\\/(\\w{2,}\\/\\w+)\\/${c}${o}?$`),new RegExp(`.*?\\/(\\w+)\\/${c}\\/(\\w+)${o}?$`),new RegExp(`.*?\\/(\\w+)\\/${c}${o}?$`),new RegExp(`.*?\\/(\\w+)\\/(${i}u${i}[pw]${i})${o}?$`)];function l(e){e=e&&e._ref?e._ref:e||"";const t=r.find(a,t=>t.test(e));return t&&e.match(t)||null}t.Ref=class{static isRef(e){return Boolean(l(e))}static getRelative(e){const t=l(e);return t&&[""].concat(t.slice(1)).join("/")||null}static getType(e){const t=l(e);return t&&t[1]||null}static getId(e){const t=l(e);return t&&t[2]||null}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(4),n=s(0),c=s(5),i=s(2),o=r;let a=!1,l=c;c.URLSearchParams&&(a=!0,l=c.URLSearchParams||c);class u{constructor(e,t={server:u.defaultRallyServer,project:void 0,workspace:void 0}){if(!n.isString(e)&&!a)throw new Error("Api key is required");this.options=t,this.options.server=t.server||u.defaultRallyServer,this.apiKey=e,this.workspace=t.workspace,this.project=t.project}static get defaultRallyServer(){return"https://rally1.rallydev.com"}static async manageResponse(e){if(!e.ok)throw new Error(`${e.statusText} Code:${e.status}`);const t=await e.json(),s=t[n.keys(t)[0]]||"",r=s.Errors||t.Errors;if(r&&r.length)throw new Error(r.map(e=>`Rally Server Error: ${e}`).join(","));let c=t;return t.QueryResult?(c=t.QueryResult.Results,t.TotalResultCount=t.QueryResult.TotalResultCount,t.PageSize=t.QueryResult.PageSize,delete t.QueryResult):t.Results?(c=t.Results,delete t.Results):s.Object&&(c=s.Object,delete t.Object),c.$rawResponse=t,c}async queryLookback(e,t=0){const s=t?`/workspace/${t}`:this.workspace,r=`${this.options.server}/analytics/v2.0/service/rally${s}/artifact/snapshot/query`,c=n.defaults(e,u.defaultLookbackRequest);let i={};this.apiKey&&(i.zsessionid=this.apiKey);const a=JSON.stringify(e,null,2),l=await o(r,{method:"POST",mode:"cors",headers:i,credentials:"include",body:a}),p=await u.manageResponse(l);p.$params=c,p.$hasMore=p.$rawResponse.HasMore;const d=p.$rawResponse;return p.$getNextPage=async()=>{if(p.$hasMore){const s=n.cloneDeep(e);return s.start+=s.pagesize,this.queryLookback(s,t)}throw new Error("No more pages in this request")},p.$getAll=async()=>{let e=p;e.$hasMore=p.$hasMore;let t=e;for(;e.$hasMore;)e=await e.$getNextPage(),t=[...e,...t];return t.$getNextPage=async()=>{throw new Error("No more pages in this request")},t.$getAll=async()=>t,t.$hasMore=!1,t.$rawResponse=d,t},p}async query(e,t={},s={}){const r=n.defaults(t,s,this.defaultOptions),c=u._prepareUrl(this.options.server,e,!1,r);let i={};this.apiKey&&(i.zsessionid=this.apiKey);const a=await o(c,{method:"GET",mode:"cors",headers:i,credentials:"include"});let l=await u.manageResponse(a);return l.$params=r,l.$hasMore=l.$rawResponse.TotalResultCount>=r.start+r.pagesize,l.$getNextPage=async()=>{if(l.$hasMore){let r=n.cloneDeep(t);return r.start+=t.pagesize,this.query(e,r,s)}throw new Error("No more pages in this request")},l.forEach(e=>this._decorateObject(e)),l}async save(e,t={},s={}){let r,c,i,a;if(i=n.isObject(e)?e:t,n.isString(e))r=e,i=t,a=s;else{if(!n.isObject(i)||!n.isString(i._ref))throw new Error('Input must be either a string representing a type like "Defect" or an object containing a string field "_ref"');a=t,i=e}let l={};if(this.apiKey&&(l.zsessionid=this.apiKey),!i.Project&&this.options.project&&(i.Project=this.options.project),i._ref)c=u._prepareUrl(this.options.server,u.getTypeFromRef(i._ref),u.getIdFromRef(i._ref),a);else{const e=n.isNumber(i.ObjectID)?`${i.ObjectID}`:"create";c=u._prepareUrl(this.options.server,r,e,a),c=n.isNumber(i.ObjectID)?`${c}/${i.ObjectID}?`:`${c}/create?`}const p={};p[r]=i;const d=JSON.stringify(p),b=await o(c,{method:"PUT",mode:"cors",headers:l,credentials:"include",body:d});let w=await u.manageResponse(b);return w.$params=a,this._decorateObject(w),w}async get(e,t=null,s={}){const r=await this._request(e,t,s,"GET");return this._decorateObject(r),r}async getCollection(e,t,s={}){const r=n.defaults(s,this.defaultOptions),c=u.getRef(e),i=u.getTypeFromRef(c),a=`${u.getIdFromRef(c)}/${t}`,l=u._prepareUrl(this.options.server,i,a,r);console.error(l),console.error(r);let p={};this.apiKey&&(p.zsessionid=this.apiKey);const d=await o(l,{method:"GET",mode:"cors",headers:p,credentials:"include"});let b=await u.manageResponse(d);return b.$params=r,b.forEach(e=>this._decorateObject(e)),e[t]=n.cloneDeep(n.defaults(b,e[t])),b}async _request(e,t=null,s={},r){let c=e;i.Ref.isRef(e)&&(c=u.getTypeFromRef(e),t=u.getIdFromRef(e));const a=n.defaults(s,{fetch:!0},this.defaultOptions);delete a.project,delete a.workspace;const l=u._prepareUrl(this.options.server,c,t,a),p={zsessionid:this.apiKey},d=await o(l,{method:r,mode:"cors",headers:p,credentials:"include"});let b=await u.manageResponse(d);return(b=b[n.keys(b)[0]]).$params=a,b}async _decorateObject(e){e.$save=()=>this.save(e),e.$delete=()=>this.delete(e)}async delete(e,t={},s=!1){let r=e;r=n.isObject(r)?r._ref:r;const c=await this._request(r,null,t,"DELETE");if(!s){await u.delay(500)}return c}static getRef(e,t=0){let s;if(n.isObject(e)){if(s=e,n.isString(s._ref))return s._ref;throw new Error("_ref must be specified to use getRef from a RallyObject")}return n.isNumber(t)&&t?`/${e}/${t}`:e.toString()}static getIdFromRef(e){return i.Ref.getId(e)}static getTypeFromRef(e){return i.Ref.getType(e)}get defaultOptions(){return{fetch:["ObjectID","Name"],start:1,pagesize:2e3,projectScopeUp:!0,projectScopeDown:!0,compact:!0,includePermissions:!0,project:void 0,workspace:this.workspace}}static get defaultLookbackRequest(){return{find:{},fields:["ObjectID","Name"],hydrate:[],start:0,pagesize:100,removeUnauthorizedSnapshots:!0}}static _prepareUrl(e,t,s="",r={}){n.isNumber(s)&&(s=s.toString()),r.workspace||delete r.workspace,r.project||delete r.project;const c=new l(r);return e.endsWith("/")||(e+="/"),`${e}slm/webservice/v2.0/${t}${s=n.isString(s)?`/${s}`:""}?${c.toString()}`}static delay(e,t=(()=>{})){return new Promise(s=>{setTimeout(s.bind(null,t),e)})}}t.Client=u},function(e,t){e.exports=fetch},function(e,t){e.exports=URLSearchParams},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(1),n=s(0);!function(e){class t{constructor(e,...t){this.typeName=e,n.isObject(t[0])?this.client=t[0]:this.client=new r.Client(t[0],t[1])}async query(e,t={},s={}){return this.client.query(this.typeName,t,s)}async save(e,t={}){return this.client.save(e,t)}async get(e,t=0,s={}){return this.client.get(e,t,s)}async getCollection(e,t,s={}){return this.client.getCollection(e,t,s)}async delete(e,t={},s=!1){return this.client.delete(e,t,s)}}e.ClassClientBase=t;e.AllowedAttributeValue=class extends t{constructor(...e){super("AllowedAttributeValue",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.AllowedQueryOperator=class extends t{constructor(...e){super("AllowedQueryOperator",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.App=class extends t{constructor(...e){super("App",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Artifact=class extends t{constructor(...e){super("Artifact",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ArtifactNotification=class extends t{constructor(...e){super("ArtifactNotification",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Attachment=class extends t{constructor(...e){super("Attachment",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.AttachmentContent=class extends t{constructor(...e){super("AttachmentContent",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.AttributeDefinition=class extends t{constructor(...e){super("AttributeDefinition",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Blocker=class extends t{constructor(...e){super("Blocker",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Build=class extends t{constructor(...e){super("Build",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.BuildDefinition=class extends t{constructor(...e){super("BuildDefinition",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Change=class extends t{constructor(...e){super("Change",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Changeset=class extends t{constructor(...e){super("Changeset",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Connection=class extends t{constructor(...e){super("Connection",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ConversationPost=class extends t{constructor(...e){super("ConversationPost",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.CumulativeFlowData=class extends t{constructor(...e){super("CumulativeFlowData",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Dashboard=class extends t{constructor(...e){super("Dashboard",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.DataMoveRequest=class extends t{constructor(...e){super("DataMoveRequest",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Defect=class extends t{constructor(...e){super("Defect",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.DefectSuite=class extends t{constructor(...e){super("DefectSuite",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.DomainObject=class extends t{constructor(...e){super("DomainObject",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Feature=class extends t{constructor(...e){super("Feature",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.FeatureToggleEntity=class extends t{constructor(...e){super("FeatureToggleEntity",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.FlowState=class extends t{constructor(...e){super("FlowState",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.HierarchicalRequirement=class extends t{constructor(...e){super("HierarchicalRequirement",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.HierarchicalRequirementPredecessorRelationship=class extends t{constructor(...e){super("HierarchicalRequirementPredecessorRelationship",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Initiative=class extends t{constructor(...e){super("Initiative",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Investment=class extends t{constructor(...e){super("Investment",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Iteration=class extends t{constructor(...e){super("Iteration",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.IterationCumulativeFlowData=class extends t{constructor(...e){super("IterationCumulativeFlowData",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Milestone=class extends t{constructor(...e){super("Milestone",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PPMConnection=class extends t{constructor(...e){super("PPMConnection",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Panel=class extends t{constructor(...e){super("Panel",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PanelDefinitionConfigProperty=class extends t{constructor(...e){super("PanelDefinitionConfigProperty",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PersistableObject=class extends t{constructor(...e){super("PersistableObject",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PortfolioItem=class extends t{constructor(...e){super("PortfolioItem",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PortfolioItemPredecessorRelationship=class extends t{constructor(...e){super("PortfolioItemPredecessorRelationship",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Preference=class extends t{constructor(...e){super("Preference",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PreliminaryEstimate=class extends t{constructor(...e){super("PreliminaryEstimate",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ProfileImage=class extends t{constructor(...e){super("ProfileImage",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Project=class extends t{constructor(...e){super("Project",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ProjectPermission=class extends t{constructor(...e){super("ProjectPermission",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.PullRequest=class extends t{constructor(...e){super("PullRequest",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.RankableArtifact=class extends t{constructor(...e){super("RankableArtifact",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.RecycleBinEntry=class extends t{constructor(...e){super("RecycleBinEntry",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Release=class extends t{constructor(...e){super("Release",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ReleaseCumulativeFlowData=class extends t{constructor(...e){super("ReleaseCumulativeFlowData",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Requirement=class extends t{constructor(...e){super("Requirement",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Revision=class extends t{constructor(...e){super("Revision",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.RevisionHistory=class extends t{constructor(...e){super("RevisionHistory",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Risk=class extends t{constructor(...e){super("Risk",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.SCMRepository=class extends t{constructor(...e){super("SCMRepository",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.SchedulableArtifact=class extends t{constructor(...e){super("SchedulableArtifact",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ScheduledTestCase=class extends t{constructor(...e){super("ScheduledTestCase",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Scope=class extends t{constructor(...e){super("Scope",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.ScopedAttributeDefinition=class extends t{constructor(...e){super("ScopedAttributeDefinition",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Slice=class extends t{constructor(...e){super("Slice",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.State=class extends t{constructor(...e){super("State",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Subscription=class extends t{constructor(...e){super("Subscription",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.SubscriptionTag=class extends t{constructor(...e){super("SubscriptionTag",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Tag=class extends t{constructor(...e){super("Tag",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Task=class extends t{constructor(...e){super("Task",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TestCase=class extends t{constructor(...e){super("TestCase",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TestCaseResult=class extends t{constructor(...e){super("TestCaseResult",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TestCaseStep=class extends t{constructor(...e){super("TestCaseStep",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TestFolder=class extends t{constructor(...e){super("TestFolder",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TestFolderStatus=class extends t{constructor(...e){super("TestFolderStatus",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TestSet=class extends t{constructor(...e){super("TestSet",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TimeEntryItem=class extends t{constructor(...e){super("TimeEntryItem",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TimeEntryValue=class extends t{constructor(...e){super("TimeEntryValue",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.TypeDefinition=class extends t{constructor(...e){super("TypeDefinition",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.User=class extends t{constructor(...e){super("User",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.UserIterationCapacity=class extends t{constructor(...e){super("UserIterationCapacity",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.UserPermission=class extends t{constructor(...e){super("UserPermission",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.UserProfile=class extends t{constructor(...e){super("UserProfile",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.WebLinkDefinition=class extends t{constructor(...e){super("WebLinkDefinition",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.WebTab=class extends t{constructor(...e){super("WebTab",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.Workspace=class extends t{constructor(...e){super("Workspace",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.WorkspaceConfiguration=class extends t{constructor(...e){super("WorkspaceConfiguration",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.WorkspaceDomainObject=class extends t{constructor(...e){super("WorkspaceDomainObject",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}};e.WorkspacePermission=class extends t{constructor(...e){super("WorkspacePermission",n.isObject(e[0])?e[0]:new r.Client(e[0],e[1]))}}}(t.ClassClients||(t.ClassClients={}))}]);
//# sourceMappingURL=web.js.map