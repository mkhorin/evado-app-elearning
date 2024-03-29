'use strict';

Vue.component('model-form', {
    props: {
        id: String,
        metaClass: String,
        metaView: String,
        readOnly: {
            type: Boolean,
            default: false
        },
        rootGroup: String,
        fileAttrs: {
            type: Array,
            default () {
                return [];
            }
        },
        visibleAttrs: Array,
        skipEmpty: {
            type: Boolean,
            default: true
        },
        translationCategory: {
            type: String,
            default () {
                return `meta.class.${this.metaClass}`;
            }
        }
    },
    data () {
        return {
            elements: []
        };
    },
    created () {
        this.load();
    },
    methods: {
        onChangeElement () {
            this.$emit('change');
        },
        getElementComponentName ({name, type, viewType}) {
            if (this.fileAttrs.includes(name)) {
                return 'model-form-file';
            }
            let result = this.formatElementComponentName(viewType);
            if (Vue.component(result)) {
                return result;
            }
            result = this.formatElementComponentName(type);
            return Vue.component(result) ? result : 'model-form-string';
        },
        formatElementComponentName (type) {
            return type ? `model-form-${type.toLowerCase()}` : null;
        },
        getRefElements () {
            return this.getRefArray('element');
        },
        async load () {
            try {
                const meta = await this.loadMeta();
                const data = await this.loadData();
                this.build(meta, data);
            } catch (err) {
                this.showError(err);
            }
        },
        async loadMeta () {
            const data = await this.fetchMeta('class', {
                class: this.metaClass
            });
            return this.metaView
                ? this.getMetaViewData(this.metaView, data)
                : data;
        },
        loadData () {
            return this.id
                ? this.loadInstanceData()
                : this.loadDefaultData();
        },
        loadInstanceData () {
            return this.fetchJson('read', {
                id: this.id,
                class: this.metaClass,
                view: this.metaView
            });
        },
        loadDefaultData () {
            return this.fetchJson('defaults', {
                class: this.metaClass,
                view: this.metaView
            });
        },
        getMetaViewData (name, data) {
            for (const view of data.views) {
                if (view.name === name) {
                    return view;
                }
            }
            throw new Error(`Meta view not found: ${name}`);
        },
        build (meta, defaultData) {
            this.metaData = this.prepareClassElements(meta, defaultData);
            this.root = this.rootGroup
                ? this.getGroup(this.rootGroup)
                : this.metaData;
            this.elements = this.root.elements;
        },
        getGroup (name) {
            if (Array.isArray(this.metaData.groups)) {
                for (const group of this.metaData.groups) {
                    if (group.name === name) {
                        return group;
                    }
                }
            }
        },
        prepareClassElements (data, defaultData) {
            if (data.elements) {
                return data;
            }
            const groupMap = Jam.ArrayHelper.index('name', data.groups);
            data.elements = [];
            for (const group of Object.values(groupMap)) {
                group._group = true;
                groupMap.hasOwnProperty(group.parent)
                    ? Jam.ObjectHelper.push(group, 'elements', groupMap[group.parent])
                    : data.elements.push(group);
            }
            for (const attr of data.attrs) {
                this.prepareAttrData(attr, defaultData);
                if (this.isVisibleAttr(attr)) {
                    groupMap.hasOwnProperty(attr.group)
                        ? Jam.ObjectHelper.push(attr, 'elements', groupMap[attr.group])
                        : data.elements.push(attr);
                }
            }
            const compare = (a, b) => a.orderNumber - b.orderNumber;
            for (const group of Object.values(groupMap)) {
                if (group.elements) {
                    data.elements.sort(compare);
                }
            }
            data.elements.sort(compare);
            return data;
        },
        isVisibleAttr (attr) {
            if (!Array.isArray(this.visibleAttrs) || this.visibleAttrs.includes(attr.name)) {
                if (!attr.readOnly || !this.skipEmpty || !this.isEmptyAttr(attr)) {
                    return true;
                }
            }
            return false;
        },
        isEmptyAttr ({value}) {
            if (value === null || value === '') {
                return true;
            }
            return Array.isArray(value) && !value.length;
        },
        prepareAttrData (attr, data) {
            attr.readOnly = this.readOnly || attr.readOnly;
            attr.value = data.hasOwnProperty(attr.name) ? data[attr.name] : undefined;
            attr.valueTitle = this.getValueTitle(attr.name, data);
        },
        validate () {
            this.clearErrors();
            this.getRefElements().forEach(ref => ref.validate());
            return !this.hasError();
        },
        clearErrors () {
            this.getRefElements().forEach(ref => ref.clearError());
        },
        hasError () {
            const refs = this.getRefElements();
            for (const ref of refs) {
                if (ref.hasError()) {
                    return true;
                }
            }
        },
        serialize () {
            const result = {};
            const refs = this.getRefElements();
            for (const ref of refs) {
                result[ref.name] = ref.serialize();
            }
            return result;
        },
        async reset () {
            const data = await this.loadData();
            const refs = this.getRefElements();
            for (const ref of refs) {
                const value = data.hasOwnProperty(ref.name) ? data[ref.name] : undefined;
                ref.setValue(value);
            }
        }
    },
    template: '#model-form'
});