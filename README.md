# Pagination.js

> A jQuery plugin to provide simple yet fully customisable pagination.

See demos and full documentation at official site: [http://pagination.js.org](http://pagination.js.org)

# Modifications 

Modified for use with [Bulma CSS Framework](https://bulma.io/)

**WARNING**: This modified version has **way** less functionality than its original.
Basically the rendering part only is being left over as this version is meant to be used with a navigator such as the backbone.js one p.e.


# Example

`
  $(selector).pagination({
                pageSize: itemsPerPage,
                nextText: "Weiter",
                prevText: "Zur&uuml;ck",
                totalNumber: itemsTotal,
                pageNumber: this.model.pageNumber,
                pageLink: linkPrefix + "/",
                activeClassName: "is-active",
                disableClassName: "is-disabled",
                ulClassName: "pagination-list",
                navClassName: "is-small is-centered"
            })
`

# License

Released under the MIT license.

MIT: [http://rem.mit-license.org](http://rem.mit-license.org/), See [LICENSE](/LICENSE)
