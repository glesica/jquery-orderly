CSC = coffee
IDIR = src/
ODIR = js/
CSFLAGS = --output $(ODIR) --compile $(IDIR)
MIN = yuicompressor

all: js/jquery.orderly.min.js

compile: js/jquery.orderly.js

clean:
	rm js/*.js

# Compile Coffeescript files to Javascript
js/%.js: src/%.coffee
	$(CSC) $(CSFLAGS)

# Minimize Javascript files
js/%.min.js: js/%.js
	$(MIN) $< -o $@
