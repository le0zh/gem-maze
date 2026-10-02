# Publishing this game

The website continues to publish from `main` at the repository root. Only generated Godot Web files, licenses, and this release workflow belong here; game source stays separate.

The reusable `Assemble game release` workflow works around a connected-tool request limit without creating a personal access token. It runs only when an explicitly prepared `release-staging` branch is pushed. It has repository-only `contents: write`, no schedule, and uses no third-party Actions.

## Release procedure

1. Export and test the game locally. Keep all output files from the same build together.
2. Record the current `main` commit and tree. Compare generated file Git blob hashes and reuse unchanged blobs, especially `index.wasm`.
3. Split `index.pck` into chunks no larger than 8,388,608 bytes. Upload the chunks using the existing authorized GitHub connection.
4. Create `release-staging` from the current main commit with this workflow and `.release-upload/manifest.json` plus `.release-upload/index.pck.part0`, `part1`, etc. Do not change main yet.
5. The manifest has `schema_version: 1`, `repository: "le0zh/gem-maze"`, `pck_size`, `pck_sha256`, `pck_blob_sha` (Git blob SHA-1), and `parts` containing sequential `path`, byte `size`, and `sha256` fields.
6. Wait for the workflow to succeed. It checks each chunk and the full pack, stores one complete blob, reports `VERIFIED_RELEASE_BLOB=<sha>`, and removes the unchanged staging branch. The workflow remains on main for future requested releases.
7. Build one complete release tree from the recorded main tree, replacing the generated changed files and the verified `index.pck` blob. Preserve the workflow, this guide, licenses and unchanged files. Create a commit with the recorded main commit as parent.
8. Recheck main and use the authorized connector to fast-forward main with `force: false`. If main moved, reconcile before publishing. Updating main with the connector, rather than the workflow's GITHUB_TOKEN, triggers the existing GitHub Pages build.
9. Verify the exact commit's Pages build, public HTML title, manifest, service-worker cache version and PCK hash before reporting completion.

A failed assembly leaves main untouched. If the staging branch moved during a run, cleanup stops rather than deleting newer work. Review the run and staging branch before retrying. Do not overwrite an unrelated `release-staging` branch.
