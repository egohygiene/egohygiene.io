# Typed review-feed receipt source mirror

The portable receipt validator and two JSON schemas in this directory are exact
byte mirrors of public Relay source
`5d27be5ce1599df883e31f14cd894eb18622c18c`, under
`actions/repository-intelligence-review-feed/`. `input-lock.json` binds the exact
five source implementation resources independently of a received artifact.
Only the standard-library contract helper is imported; no normalizer, consumer
code or artifact-provided executable is loaded.

The adjacent original Relay MIT license applies to these imported resources.
It does not select a license for the website's first-party code, resolve website
#59 or change creative/asset rights. A receipt's implementation claims are
checked against the authored lock, not used as their own expectation. The
website's existing pinned owner/public-source loader still admits model
semantics; this helper supplies only byte and source binding.
