<script>
import Loading from '@shell/components/Loading';
import { Banner } from '@components/Banner';
import CreateEditView from '@shell/mixins/create-edit-view';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import KeyValue from '@shell/components/form/KeyValue';
import { LabeledInput } from '@components/Form/LabeledInput';
import { NORMAN, SECRET } from '@shell/config/types';
import { stringify } from '@shell/utils/error';
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
      mode: {
         type:    String,
         default: 'create',
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

      console.log("this.credentialId", this.credentialId);

      // try {
      //    this.credential = await this.$store.dispatch('rancher/find', { type: NORMAN.CLOUD_CREDENTIAL, id: this.credentialId });
      //    console.log("this.credential", this.credential);
      // } catch (e) {
      //    this.credential = null;
      // }

      // Try and get the secret for the Cloud Credential as we need the plain-text password
      try {
         const id = this.credentialId.replace(':', '/');
         const secret = await this.$store.dispatch('management/find', { type: SECRET, id });
         console.log("secret", secret);

         // account
         let data = secret.data['tritoncredentialConfig-account'];
         console.log("data", data);
         const account = atob(data);
         console.log("account", account);

         // keyId
         data = secret.data['tritoncredentialConfig-keyId'];
         const keyId = atob(data);
         console.log("keyId", keyId);

         // keyMaterial
         data = secret.data['tritoncredentialConfig-keyMaterial'];
         const keyMaterial = atob(data);
         console.log("keyMaterial", keyMaterial);

         // tlsInsecure
         data = secret.data['tritoncredentialConfig-tlsInsecure'];
         const tlsInsecure = atob(data);
         console.log("tlsInsecure", tlsInsecure);

         // url
         data = secret.data['tritoncredentialConfig-url'];
         const url = atob(data);
         console.log("url", url);

         this.url = url;
         this.tlsInsecure = tlsInsecure;
         this.account = account;
         this.keyId = keyId;
         this.keyMaterial = keyMaterial;
      } catch (e) {
         // this.credential = null;
         // this.password = '';
         // this.havePassword = false;
         console.error(e); // eslint-disable-line no-console
      }
   },

   data() {
      return {
         image: this.value?.image || '',
         package: this.value?.package || '',
         sshUser: this.value?.sshUser || '',
         actAs: this.value?.actAs || '',
         tags: this.value?.tags || '',
         mdata: this.value?.mdata || '',
         // temp input objects
         mdataObject: null,
         tagsObject: null,
         credential: null,
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
      // set metada string from UI object input
      metadataObjectToString(mdataObject) {
         console.log('mdataObject', mdataObject);
         const array = [];

         for (const k in mdataObject) {
            array.push(`${k}=${mdataObject[k]}`);
         }

         this.$set(this.value, 'mdata', array.join(','));

         console.log('mdataObject', mdataObject);
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
         console.log('tagsObject', tagsObject);
         const array = [];

         for (const k in tagsObject) {
            array.push(`${k}=${tagsObject[k]}`);
         }

         this.$set(this.value, 'tags', array.join(','));

         console.log('tagsObject', tagsObject);
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
      },
      syncValue() {
         // Note: We don't need to provide password as this is picked up via the credential

         // Copy the values from the form to the correct places on the value
         
         // credential info
         this.value.url = this.url;
         this.value.tlsInsecure = this.tlsInsecure;
         this.value.account = this.account;
         this.value.keyId = this.keyId;
         this.value.keyMaterial = this.keyMaterial;
         
         // machine info
         this.value.image = this.image;
         this.value.package = this.package;
         this.value.sshUser = this.sshUser;
         this.value.actAs = this.actAs;
      },

      test() {
         this.syncValue();
      }
   }
}
</script>

<template>
   <div>
      <div class="triton-config">
         <!-- <div class="title">
            Triton Configuration
         </div> -->
         <h3>Triton Configuration</h3>
      </div>
      <div class="row mt-10">
         <div class="col span-6">
            <LabeledInput :value="this.image" label-key="driver.triton.machine.fields.image.label" type="text" :mode="mode"
               :required="true" data-testid="triton-machine-config-image" v-model="image"
               v-tooltip="t('driver.triton.machine.fields.image.tooltip')" />
            <!-- <p class="text-muted mt-10">Image name, name@version, id, or short id (from `triton image list`)</p> -->
         </div>
         <div class="col span-6">
            <LabeledInput :value="this.package" label-key="driver.triton.machine.fields.package.label" type="text"
               :mode="mode" :required="true" data-testid="triton-machine-config-package"
               v-model="package" v-tooltip="t('driver.triton.machine.fields.package.tooltip')" />
            <!-- <p class="text-muted mt-10">Package name, id, or short id (from `triton package list`)</p> -->
         </div>
      </div>
      <div class="row mt-10">
         <div class="col span-6">
            <LabeledInput :value="this.sshUser" label-key="driver.triton.machine.fields.sshUser.label" type="text"
               :mode="mode" :required="true" data-testid="triton-machine-config-ssh-user"
               v-model="sshUser" v-tooltip="t('driver.triton.machine.fields.sshUser.tooltip')" />
            <!-- <p class="text-muted mt-10">Triton SSH user</p> -->
         </div>
         <div class="col span-6">
            <LabeledInput :value="this.actAs" label-key="driver.triton.machine.fields.actAs.label" type="text" :mode="mode"
               :required="false" data-testid="triton-machine-config-act-as" v-model="actAs"
               v-tooltip="t('driver.triton.machine.fields.actAs.tooltip')" />
            <!-- <p class="text-muted mt-10">Masquerade as the given account login name</p> -->
         </div>
      </div>
      <!-- <div class="row mt-10">
         <div class="col span-12">
            <LabeledInput :value="this.tags" label-key="driver.triton.machine.fields.tags.label" type="text" :mode="mode"
               :required="false" data-testid="triton-machine-config-tags" @input="value.setData('tags', $event)" />
            <p class="text-muted mt-10">Tags assigned to the VM (key=value pairs comma delimited)</p>
         </div>
      </div> -->
      <div class="row mt-10">
         <div class="col span-12">
            <h4>
               <t k="driver.triton.machine.fields.tags.label" v-tooltip="t('driver.triton.machine.fields.tags.tooltip')"/>
            </h4>
            <KeyValue
               :value="tagsObject"
               :mode="mode"
               :read-allowed="false"
               add-label="Add Tag"
               :initial-empty-row="true"
               @input="tagsObjectToString"
               :parserSeparators="['=']"
               protip="Paste lines of <em>key=value</em> into any key field for easy bulk entry"
            />
            <!-- <p class="text-muted mt-10">Tags assigned to the VM</p> -->
         </div>
      </div>
      <!-- <div class="row mt-10">
         <div class="col span-12">
            <LabeledInput :value="this.mdata" label-key="driver.triton.machine.fields.mdata"
               type="text" :mode="mode" :required="false" data-testid="triton-machine-config-mdata"
               @input="value.setData('mdata', $event)" />
            <p class="text-muted mt-10">Metadata assigned to the VM (key=value pairs comma delimited)</p>
         </div>
      </div> -->
      <div class="row mt-10">
         <div class="col span-12">
            <h4>
               <t k="driver.triton.machine.fields.mdata.label" v-tooltip="t('driver.triton.machine.fields.mdata.tooltip')"/>
            </h4>
            <KeyValue
               :value="mdataObject"
               :mode="mode"
               :read-allowed="false"
               add-label="Add Metadata"
               :initial-empty-row="true"
               @input="metadataObjectToString"
               :parserSeparators="['=']"
               protip="Paste lines of <em>key=value</em> into any key field for easy bulk entry"
            />
            <!-- <p class="text-muted mt-10">Metadata assigned to the VM</p> -->
         </div>
      </div>
   </div>
</template>