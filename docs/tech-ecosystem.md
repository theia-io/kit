# Overview

The nx team at nrwl recommend adopting a layered, DDD approach to developing in a monorepo, with clearly-defined module responsibilities and boundaries, [book](https://go.nx.dev/angular-enterprise-monorepo-patterns-new-book).

This monorepo has adopted this approach and has split libraries vertically by “scope” (i.e., the domain, or very high-level feature of the app where the library is used) and horizontally by “type” (i.e., the layer, or responsibility of the library). There are four types (layers) in use:

- Feature: libraries that implement smart UI for Business Use Cases specific to that feature. May also contain presentational components and services which are tightly-coupled to the feature’s smart component.

- UI: Libraries that contain only reusable dumb components, directives and pipes. The components in a ui library contain zero business logic and may only communicate with external code through inputs and outputs. I.e., they may not make use of services or any other dependency-injection items.

- Data: Libraries that contain only data-access and state management services. Must not contain any Components or Directives.

- Util: For utility services, functions and classes that do not fit elsewhere. Must not contain any Components, Directives, data-access or state management code.
