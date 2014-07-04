## ############################### Variables ################################

# Software Definitions

LINT=jshint
## SVG2PNG  : program to convert SVG to PNG
SVG2PNG=convert
## TeXZilla : the name of TeXZilla file
TeXZilla = js/TeXZilla.js

# Package Variables

PACKAGENAME = TeXEditor

PACKAGELIST = building-blocks \
              css \
              icons \
              index.html \
              js \
              manifest.webapp

ICONS = $(foreach size, 32 60 90 120 128 256, icons/$(PACKAGENAME)-$(size).png)

## 
## ################################ Commands ################################

## help     : print this text
help:
	@grep -e '^##' Makefile | sed 's/## //'

## beautify : beautify the files
beautify:
	html-beautify -r -f index.html
	find css -name '*.css' -type f -exec css-beautify -r -f {} \;
	find js -name '*.js' -type f -exec js-beautify -r -f {} \;

## build    : build some files need for this webapp
build: ${ICONS} ${TeXZilla}

## lint     : lint Javascript files
lint :
	$(LINT) js

## package  : package the webapp
package: build
	zip -r $(PACKAGENAME).zip ${PACKAGELIST}

## cleanall : remove the files built previously
cleanall:
	rm -f ${ICONS}
	rm -f $(PACKAGENAME)

# Auxiliar rules

${TeXZilla}:
	wget https://raw.githubusercontent.com/fred-wang/TeXZilla/TeXZilla-0.9.7/TeXZilla.js \
	    -O ${TeXZilla}

icons/%.png: icons/$(PACKAGENAME).svg
	$(SVG2PNG) -density 512 -background none $< -resize $(subst icons/$(PACKAGENAME)-,,$(basename $@)) $@
