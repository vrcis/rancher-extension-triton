import MachineTemplate from '@shell/models/rke-machine.cattle.io.machinetemplate';

export default class TritonMachineTemplate extends MachineTemplate {
  get provider() {
    return 'triton';
  }

  get providerLocation() {
    return this.spec.template.spec.url;
  }

  get providerSize() {
    return this.spec.template.spec.package;
  }
}
