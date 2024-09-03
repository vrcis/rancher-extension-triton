<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import { LabeledInput } from '@components/Form/LabeledInput';
// import { azureEnvironments } from '@shell/machine-config/azure';
// import { parseAzureError } from '@shell/utils/azure';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import FileSelector, { createOnSelected } from '@shell/components/form/FileSelector';
import { base64Encode } from '@shell/utils/crypto';

export default {
   components: {
      LabeledInput,
      LabeledSelect,
      FileSelector
   },
   mixins: [CreateEditView],

   async fetch() {
    this.driver = await this.$store.dispatch('rancher/find', {
      type: 'nodedriver',
      name:   'triton'
    });
  },

   data() {
      return {
         tlsInsecureOptions: [
            { value: "true" },
            { value: "false" },
         ]
      };
   },

   watch: {
      'value.decodedData.url'(neu) {
         this.$emit('validationChanged', !!neu);
      },
      'value.decodedData.tlsInsecure'(neu) {
         this.$emit('validationChanged', !!neu);
      },
      'value.decodedData.account'(neu) {
         this.$emit('validationChanged', !!neu);
      },
      // 'value.decodedData.actAs'(neu) {
      //    this.$emit('validationChanged', !!neu);
      // },
      'value.decodedData.keyId'(neu) {
         this.$emit('validationChanged', !!neu);
      },
      'value.decodedData.keyMaterial'(neu) {
         this.$emit('validationChanged', !!neu);
      }
   },

   methods: {
      onKeyMaterialSelected(privateKey) {
         const encoded = base64Encode(privateKey);
         this.value.setData('keyMaterial', encoded);
         // this.value.setData('keyMaterialDecoded', privateKey);
         console.log('this.value', this.value);
      },

      // update() {
      //    this.value.setData('ssh-publickey', this.username);
      //    this.value.setData('ssh-privatekey', this.password);
      // }
  },

   // methods: {
      // async test() {
      //    const {
      //       account,
      //       keyId,
      //       keyMaterial,
      //       url,
      //       tlsInsecure
      //    } = this.value.decodedData;

      //    try {
      //       await this.$store.dispatch('management/request', {
      //          url: '/meta/aksCheckCredentials',
      //          method: 'POST',
      //          data: {
      //             account,
      //             keyId,
      //             keyMaterial,
      //             url,
      //             tlsInsecure,
      //          },
      //          redirectUnauthorized: false,
      //       });

      //       return true;
      //    } catch (e) {
      //       if (e.error) {
      //          // const parsed = parseAzureError(e.error);

      //          // if (parsed) {
      //             return { errors: [e.error] };
      //          // }
      //       }

      //       // Can't parse error, so go with the generic 'auth failed' error message
      //       return false;
      //    }
      // },
   // },
};
</script>

<template>
   <section>
      <div class="row mb-10">
         <div class="col span-6">
            <LabeledInput :value="value.decodedData.url"
               label-key="driver.triton.auth.fields.url" type="text" :mode="mode" :required="true"
               data-testid="triton-cloud-credentials-url" @input="value.setData('url', $event)" />
            <p class="text-muted mt-10">URL of the CloudAPI endpoint</p>
         </div>
         <div class="col span-6">
            <LabeledSelect :value="value.decodedData.tlsInsecure" :mode="mode" :options="tlsInsecureOptions"
               option-key="value" option-label="value" :searchable="false" :required="true"
               label-key="driver.triton.auth.fields.tlsInsecure"
               data-testid="triton-cloud-credentials-tls-insecure" @input="value.setData('tlsInsecure', $event)" />
            <p class="text-muted mt-10">Whether to validate the CloudAPI SSL certificate</p>
         </div>
      </div>
      <div class="row mb-10">
         <div class="col span-6">
            <LabeledInput :value="value.decodedData.account" label-key="driver.triton.auth.fields.account"
               type="text" :mode="mode" :required="true" data-testid="triton-cloud-credentials-account"
               @input="value.setData('account', $event)" />
            <p class="text-muted mt-10">Login name/username</p>
         </div>
         <!-- <div class="col span-4">
            <LabeledInput :value="value.decodedData.actAs" label-key="driver.triton.auth.fields.actAs"
               type="text" :mode="mode" :required="false" data-testid="triton-cloud-credentials-act-as"
               @input="value.setData('actAs', $event)" />
            <p class="text-muted mt-10">Masquerade as the given account login name</p>
         </div> -->
         <div class="col span-6">
            <LabeledInput :value="value.decodedData.keyId"
               label-key="driver.triton.auth.fields.keyId" type="text" :mode="mode" :required="true"
               data-testid="triton-cloud-credentials-key-id" @input="value.setData('keyId', $event)" />
            <p class="text-muted mt-10">The md5 fingerprint of the SSH public key that has been added to the account</p>
         </div>
      </div>
      <div class="row mb-10">
         <div class="col span-12">
            <LabeledInput :value="value.decodedData.keyMaterial"
               label-key="driver.triton.auth.fields.keyMaterial" type="multiline" :mode="mode" :required="true" :min-height="100"
               data-testid="triton-cloud-credentials-key-material" @input="value.setData('keyMaterial', $event)" />
            <p class="text-muted mt-10">The SSH private key (base64 encoded) that has been added to the account</p>
            <FileSelector
               class="btn btn-sm bg-primary mt-10"
               :label="t('generic.readFromFile')"
               @selected="onKeyMaterialSelected"
            />
            <!-- <FileSelector
                class="role-tertiary add mt-5"
                :label="t('generic.readFromFile')"
                :mode="mode"
                @selected="value.setData('keyMaterial', $event)"
              /> -->
         </div>
      </div>
   </section>
</template>