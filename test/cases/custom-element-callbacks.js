import Impl from "./custom-element-callbacks-impl.js";
export default class CustomElementCallbacks {}
CustomElementCallbacks.prototype.createdCallback = Impl.prototype.createdCallback;
CustomElementCallbacks.prototype.attachedCallback = Impl.prototype.attachedCallback;
CustomElementCallbacks.prototype.detachedCallback = Impl.prototype.detachedCallback;
CustomElementCallbacks.prototype.attributeChangedCallback = Impl.prototype.attributeChangedCallback;
window.CustomElementCallbacks = CustomElementCallbacks;
