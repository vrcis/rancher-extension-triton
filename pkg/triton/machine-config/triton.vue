<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import KeyValue from '@shell/components/form/KeyValue';
import { LabeledInput } from '@components/Form/LabeledInput';
import { NORMAN, SECRET } from '@shell/config/types';
import { _CREATE, _EDIT } from '@shell/config/query-params';

export default {
   components: {
      LabeledInput, KeyValue
   },

   mixins: [CreateEditView],

   props: {
      credentialId: {
         type:     String,
         required: true,
      },
      disabled: {
         type:    Boolean,
         default: false
      }
   },

   async fetch() {
      this.errors = [];

      if (!this.credentialId) {
         return;
      }

      if (this.mode === _EDIT) {
         this.initForEditMode();
         return;
      }

      try {
         this.credential = await this.$store.dispatch('rancher/find', { type: NORMAN.CLOUD_CREDENTIAL, id: this.credentialId });
         
         this.value.url = this.credential.tritoncredentialConfig.url;
         this.value.tlsInsecure = this.credential.tritoncredentialConfig.tlsInsecure;
         this.value.account = this.credential.tritoncredentialConfig.account;
         this.value.keyId = this.credential.tritoncredentialConfig.keyId;
         this.value.keyMaterial = this.credential.tritoncredentialConfig.keyMaterial;
      } catch (e) {
         this.credential = null;
      }

      this.defaultConfig();
   },

   data() {
      // temp objects for data input
      return {
         mdataObject: null,
         tagsObject: null
      };
   },

   watch: {
    'credentialId'() {
      this.$fetch();
    },
  },

   methods: {
      initForEditMode() {
         this.metadataStringToObject();
         this.tagsStringToObject();
      },
      defaultConfig() {
         const poolIndex = this.$attrs["pool-index"];
         const machinePools = this.$attrs["machine-pools"];

         // if this is not the first machine pool and it's the most recent
         // one created then default some fields from the first machine pool
         if (machinePools && poolIndex > 0 && poolIndex == (machinePools.length - 1)) {
            const firstMachinePool = machinePools[0];

            if (!this.value.image)
               this.value.image = firstMachinePool.config.image;

            if (!this.value.sshUser)
               this.value.sshUser = firstMachinePool.config.sshUser;

            if (!this.value.actAs)
               this.value.actAs = firstMachinePool.config.actAs;
         }
      },
      // set metada string from UI object input
      metadataObjectToString(mdataObject) {
         const array = [];

         for (const k in mdataObject) {
            array.push(`${k}=${mdataObject[k]}`);
         }

         this.$set(this.value, 'mdata', array.join(','));
      },
      // populate metadata in UI from existing string value
      metadataStringToObject() {
         const entries = (this.value.mdata || '').split(/,/);
         const out = {};

         // for each entry
         entries.forEach(function(entry) {
            const key = entry.substring(0, entry.indexOf("=")).trim();
            const value = entry.substring(entry.indexOf("=") + 1).trim();

            if (key) {
               out[key] = value;
            }
         });

         this.mdataObject = out;
      },
      // set tags string from UI object input
      tagsObjectToString(tagsObject) {
         const array = [];

         for (const k in tagsObject) {
            array.push(`${k}=${tagsObject[k]}`);
         }

         this.$set(this.value, 'tags', array.join(','));
      },
      // populate tags in UI from existing string value
      tagsStringToObject() {
         const entries = (this.value.tags || '').split(/,/);
         const out = {};

         // for each entry
         entries.forEach(function(entry) {
            const key = entry.substring(0, entry.indexOf("=")).trim();
            const value = entry.substring(entry.indexOf("=") + 1).trim();

            if (key) {
               out[key] = value;
            }
         });

         this.tagsObject = out;
      }
   }
}
</script>

<template>
   <div>
      <div class="triton-config">
         <h3>Triton Configuration</h3>
      </div>
      <div class="row mt-10">
         <div class="col span-6">
            <LabeledInput
               v-model:value="value.image"
               type="text"
               :mode="mode"
               :required="true"
               :disabled="disabled"
               label-key="driver.triton.machine.fields.image.label"
               v-tooltip="t('driver.triton.machine.fields.image.tooltip')"
               data-testid="triton-machine-config-image"
            />
         </div>
         <div class="col span-6">
            <LabeledInput
               v-model:value="value.package"
               type="text"
               :mode="mode"
               :required="true"
               :disabled="disabled"
               label-key="driver.triton.machine.fields.package.label"
               v-tooltip="t('driver.triton.machine.fields.package.tooltip')"
               data-testid="triton-machine-config-package"
            />
         </div>
      </div>
      <div class="row mt-10">
         <div class="col span-6">
            <LabeledInput
               v-model:value="value.sshUser"
               type="text"
               :mode="mode"
               :required="true"
               :disabled="disabled"
               label-key="driver.triton.machine.fields.sshUser.label"
               v-tooltip="t('driver.triton.machine.fields.sshUser.tooltip')"
               data-testid="triton-machine-config-ssh-user"
            />
         </div>
         <div class="col span-6">
            <LabeledInput
               v-model:value="value.actAs"
               type="text"
               :mode="mode"
               :required="false"
               :disabled="disabled"
               label-key="driver.triton.machine.fields.actAs.label"
               v-tooltip="t('driver.triton.machine.fields.actAs.tooltip')"
               data-testid="triton-machine-config-act-as"
            />
         </div>
      </div>
      <div class="row mt-10">
         <div class="col span-12">
            <h4>
               <t k="driver.triton.machine.fields.tags.label" v-tooltip="t('driver.triton.machine.fields.tags.tooltip')"/>
            </h4>
            <KeyValue
               v-model:value="tagsObject"
               :mode="mode"
               :disabled="disabled"
               add-label="Add Tag"
               :initial-empty-row="true"
               @input="tagsObjectToString"
               :parserSeparators="['=']"
               protip="Paste lines of <em>key=value</em> into any key field for easy bulk entry"
            />
         </div>
      </div>
      <div class="row mt-10">
         <div class="col span-12">
            <h4>
               <t k="driver.triton.machine.fields.mdata.label" v-tooltip="t('driver.triton.machine.fields.mdata.tooltip')"/>
            </h4>
            <KeyValue
               v-model:value="mdataObject"
               :mode="mode"
               :disabled="disabled"
               add-label="Add Metadata"
               :initial-empty-row="true"
               @input="metadataObjectToString"
               :parserSeparators="['=']"
               protip="Paste lines of <em>key=value</em> into any key field for easy bulk entry"
            />
         </div>
      </div>
   </div>
</template>