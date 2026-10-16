<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Use flat TanStack content routes and a shared restaurant shell; this preserves separate shareable pages and consistent navigation.
- Keep business catalog/settings in Cloud and catering writes in a validated, rate-limited server function; public visitors must never read catering leads.
- Use the Lovable Cloud data editor as the owner CMS; no visitor can modify prices or store status.
- Unknown business details remain unset rather than invented; order drafts can be copied until an official WhatsApp destination is configured.
- Generated restaurant photography is illustrative and must be replaced with verified venue media before presenting it as real documentation.
