# 1. All single properties
# 2. 3 categories with 3 properties each
# 3. 4 categories with 3 properties each

# After svg generation
# gimp batchprocessing -> select all svg -> output: png
# mogrify -trim +repage *


def main():
    colors = [
        #["darkturquoise", "aquamarine"],
        ["purple", "mediumpurple"],
        ["yellow", "darkkhaki"],
        ["darkorange", "peachpuff"],
        ["red", "lightsalmon"],
        ["blue", "aqua"],
        ["lime", "seagreen"]
    ]
    shapes = ["square", "circle", "triangle", "ellipse", "octagon", "rhombus"]
    fillings = ["none", "url(#stripe)", "url(#dotted)"]
    numbers = ["one", "two", "three", "four", "five", "six"]

    for single in [True, True]:
        if single:
            for shape in shapes:
                i = 1
                for [colordefault, colordark] in colors:
                    square = "none"
                    circle = "none"
                    triangle = "none"
                    ellipse = "none"
                    octagon = "none"
                    rhombus = "none"
                    one = "none"
                    two = "none"
                    three = "none"
                    four = "none"
                    five = "none"
                    six = "none"

                    filling = "none"

                    if shape == "square":
                        square = "inherit"
                    elif shape == "circle":
                        circle = "inherit"
                    elif shape == "triangle":
                        triangle = "inherit"
                    elif shape == "ellipse":
                        ellipse = "inherit"
                    elif shape == "octagon":
                        octagon = "inherit"
                    else:
                        rhombus = "inherit"

                    imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, octagon, rhombus, filling, one, two,
                                         three, four, five, six)

                    with open("images/svg/" + shape + str(i) + ".svg", "w+") as file:
                        file.write(imageString)

                    i = i + 1

            for [colordefault, colordark] in colors:
                i = 1
                for shape in shapes:
                    square = "none"
                    circle = "none"
                    triangle = "none"
                    ellipse = "none"
                    octagon = "none"
                    rhombus = "none"
                    one = "none"
                    two = "none"
                    three = "none"
                    four = "none"
                    five = "none"
                    six = "none"

                    filling = "none"

                    if shape == "square":
                        square = "inherit"
                    elif shape == "circle":
                        circle = "inherit"
                    elif shape == "triangle":
                        triangle = "inherit"
                    elif shape == "ellipse":
                        ellipse = "inherit"
                    elif shape == "octagon":
                        octagon = "inherit"
                    else:
                        rhombus = "inherit"

                    imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, octagon, rhombus, filling, one, two,
                                         three, four, five, six)

                    with open("images/svg/" + colordefault + str(i) + ".svg", "w+") as file:
                        file.write(imageString)

                    i = i + 1

            for filling in fillings:
                i = 1
                for shape in shapes:
                    for [colordefault, colordark] in colors:
                        square = "none"
                        circle = "none"
                        triangle = "none"
                        ellipse = "none"
                        octagon = "none"
                        rhombus = "none"
                        one = "none"
                        two = "none"
                        three = "none"
                        four = "none"
                        five = "none"
                        six = "none"

                        if shape == "square":
                            square = "inherit"
                        elif shape == "circle":
                            circle = "inherit"
                        elif shape == "triangle":
                            triangle = "inherit"
                        elif shape == "ellipse":
                            ellipse = "inherit"
                        elif shape == "octagon":
                            octagon = "inherit"
                        else:
                            rhombus = "inherit"

                        fillingname = "full"
                        if filling != "none":
                            fillingname = filling[5:len(filling) - 1]

                        imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, octagon, rhombus, filling, one, two,
                                             three, four, five, six)

                        with open("images/svg/" + fillingname + str(i) + ".svg", "w+") as file:
                            file.write(imageString)

                        i = i + 1

            for number in numbers:
                i = 1
                for shape in shapes:
                    for [colordefault, colordark] in colors:
                        square = "none"
                        circle = "none"
                        triangle = "none"
                        ellipse = "none"
                        octagon = "none"
                        rhombus = "none"
                        one = "none"
                        two = "none"
                        three = "none"
                        four = "none"
                        five = "none"
                        six = "none"

                        filling = "none"

                        if shape == "square":
                            square = "inherit"
                        elif shape == "circle":
                            circle = "inherit"
                        elif shape == "triangle":
                            triangle = "inherit"
                        elif shape == "ellipse":
                            ellipse = "inherit"
                        elif shape == "octagon":
                            octagon = "inherit"
                        else:
                            rhombus = "inherit"

                        if number == "one":
                            one = "inherit"
                        elif number == "two":
                            two = "inherit"
                        elif number == "three":
                            three = "inherit"
                        elif number == "four":
                            four = "inherit"
                        elif number == "five":
                            five = "inherit"
                        else:
                            six = "inherit"

                        imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, octagon, rhombus, filling, one, two,
                                             three, four, five, six)

                        with open("images/svg/" + number + str(i) + ".svg", "w+") as file:
                            file.write(imageString)

                        i = i + 1

        if not single:
            with open("temp.txt", "w") as file:
                file.write("")
                file.close()

            for colordefault, colordark in colors:
                for shape in shapes:
                    for filling in fillings:
                        for number in numbers:
                            square = "none"
                            circle = "none"
                            triangle = "none"
                            ellipse = "none"
                            octagon = "none"
                            rhombus = "none"
                            one = "none"
                            two = "none"
                            three = "none"
                            four = "none"
                            five = "none"
                            six = "none"

                            if shape == "square":
                                square = "inherit"
                            elif shape == "circle":
                                circle = "inherit"
                            elif shape == "triangle":
                                triangle = "inherit"
                            elif shape == "ellipse":
                                ellipse = "inherit"
                            elif shape == "octagon":
                                octagon = "inherit"
                            else:
                                rhombus = "inherit"


                            if number == "one":
                                one = "inherit"
                            elif number == "two":
                                two = "inherit"
                            elif number == "three":
                                three = "inherit"
                            elif number == "four":
                                four = "inherit"
                            elif number == "five":
                                five = "inherit"
                            else:
                                six = "inherit"

                            fillingname = "full"
                            if filling != "none":
                                fillingname = filling[5:len(filling) - 1]

                            imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, octagon, rhombus, filling, one,
                                                 two, three, four, five, six)

                            filename = colordefault + shape + number + fillingname

                            with open("images/svg/" + filename + ".svg", "w+") as file:
                                file.write(imageString)
                                file.close()

                            with open("temp.txt", "a") as file:
                                file.seek(0, 2)
                                file.writelines([
                                    "- name: " + colordefault + shape + number + fillingname + ".png\n",
                                    "  cat1: " + colordefault + "\n",
                                    "  cat2: " + shape + "\n",
                                    "  cat3: " + number + "\n",
                                    "  cat4: " + fillingname + "\n"
                                ])
                                file.close()


def imgStr(colordefault, colordark, square, circle, triangle, ellipse, octagon, rhombus, filling, one, two, three, four, five, six):
    imageString = "<?xml version=\"1.0\" standalone=\"yes\"?>\n\
    \n\
    <svg height=\"1000\" width=\"1000\" viewbox=\"0 0 1000 1000\" xmlns=\"http://www.w3.org/2000/svg\">\n\
    <defs>\n\
            <pattern id=\"stripe\" patternUnits=\"userSpaceOnUse\" width=\"20%\" height=\"20%\">\n\
                <path stroke=\"" + colordark + "\" stroke-linecap=\"butt\" stroke-width=\"50\" d=\"M -20 -20 l1000 1000\"/>\n\
                <path stroke=\"" + colordark + "\" stroke-linecap=\"butt\" stroke-width=\"50\" d=\"M -20 180 l1000 1000\"/>\n\
                <path stroke=\"" + colordark + "\" stroke-linecap=\"butt\" stroke-width=\"50\" d=\"M -20 -220 l1000 1000\"/>\n\
    \n\
            </pattern>\n\
            <pattern id=\"dotted\" enable-background=\"true\" patternUnits=\"userSpaceOnUse\" width=\"15%\" height=\"15%\">\n\
                <circle cx=\"30\" cy=\"30\" r=\"25\" fill=\"" + colordark + "\" />\n\
                <circle cx=\"105\" cy=\"105\" r=\"25\" fill=\"" + colordark + "\" />\n\
            </pattern>\n\
            <style>\n\
            .button {\n\
    \n\
            stroke-width:5;\n\
            stroke:black;\n\
    \n\
            }\n\
        </style>\n\
        </defs>\n\
    \n\
     <g id=\"circle\" display=\"" + circle + "\">\n\
         <circle cx=\"500\" cy=\"500\" r=\"300\" class=\"button\" fill=\"" + colordefault + "\"/>\n\
         <circle cx=\"500\" cy=\"500\" r=\"300\" class=\"button\" fill=\"" + filling + "\"/>\n\
         <circle cx=\"500\" cy=\"500\" r=\"250\" class=\"button\" fill=\"none\"/>\n\
     </g>\n\
    \n\
     <g id=\"square\" display=\"" + square + "\">\n\
      <rect x=\"250\" y=\"250\" rx=\"20\" ry=\"20\" width=\"500\" height=\"500\" class=\"button\" fill=\"" + colordefault + "\"/>\n\
      <rect x=\"250\" y=\"250\" rx=\"20\" ry=\"20\" width=\"500\" height=\"500\" class=\"button\" fill=\"" + filling + "\"/>\n\
      <rect x=\"300\" y=\"300\" rx=\"20\" ry=\"20\" width=\"400\" height=\"400\" class=\"button\" fill=\"none\"/>\n\
     </g>\n\
    \n\
     <g id=\"triangle\" display=\"" + triangle + "\">\n\
      <polygon points=\"500,50 113.4,700 886.6,700\" stroke-linejoin=\"round\" class=\"button\" fill=\"" + colordefault + "\" />\n\
      <polygon points=\"500,50 113.4,700 886.6,700\" stroke-linejoin=\"round\" class=\"button\" fill=\"" + filling + "\" />\n\
      <polygon points=\"500,150 200,650 800,650\" stroke-linejoin=\"round\" class=\"button\" fill=\"none\"/>\n\
     </g>\n\
    \n\
     <g id=\"ellipse\" display=\"" + ellipse + "\">\n\
      <ellipse cx=\"500\" cy=\"500\" rx=\"400\" ry=\"250\" class=\"button\" fill=\"" + colordefault + "\" />\n\
      <ellipse cx=\"500\" cy=\"500\" rx=\"400\" ry=\"250\" class=\"button\" fill=\"" + filling + "\" />\n\
      <ellipse cx=\"500\" cy=\"500\" rx=\"350\" ry=\"200\" class=\"button\" fill=\"none\" />\n\
     </g>\n\
     <g id=\"octagon\" display=\"" + octagon + "\">\n\
      <polygon points=\"400,250 600,250 750,400 750,600 600,750 400,750 250,600 250,400\" stroke-linejoin=\"round\" class=\"button\" fill=\"" + colordefault + "\" />\n\
      <polygon points=\"400,250 600,250 750,400 750,600 600,750 400,750 250,600 250,400\" stroke-linejoin=\"round\" class=\"button\" fill=\"" + filling + "\" />\n\
      <polygon points=\"400,300 600,300 700,400 700,600 600,700 400,700 300,600 300,400\" stroke-linejoin=\"round\" class=\"button\" fill=\"none\"/>\n\
     </g>\n\
     \n\
     <g id=\"rhombus\" display=\"" + rhombus + "\">\n\
      <polygon points=\"350,250 150,750 650,750 850,250\" stroke-linejoin=\"round\" class=\"button\" fill=\"" + colordefault + "\" />\n\
      <polygon points=\"350,250 150,750 650,750 850,250\" stroke-linejoin=\"round\" class=\"button\" fill=\"" + filling + "\" />\n\
      <polygon points=\"390,300 230,700 620,700 770,300\" stroke-linejoin=\"round\" class=\"button\" fill=\"none\"/>\n\
     </g>\n\
    \n\
    \n\
     <g id=\"one\" display=\"" + one + "\"> \n\
      <circle cx=\"500\" cy=\"500\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
     </g>\n\
    \n\
     <g id=\"two\" display=\"" + two + "\"> \n\
      <circle cx=\"570\" cy=\"500\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"500\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
     </g>\n\
    \n\
    <g id=\"three\" display=\"" + three + "\"> \n\
      <circle cx=\"570\" cy=\"560\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"560\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"500\" cy=\"440\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
     </g> \n\
    \n\
    <g id=\"four\" display=\"" + four + "\"> \n\
      <circle cx=\"570\" cy=\"430\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"430\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"570\" cy=\"570\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"570\" r=\"40\" stroke=\"black\" fill=\"black\"/> \n\
    </g> \n\
    <g id=\"five\" display=\"" + five + "\">\n\
      <circle cx=\"570\" cy=\"430\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"430\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"570\" cy=\"570\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"570\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"500\" cy=\"500\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
    </g>\n\
    \n\
    <g id=\"six\" display=\"" + six + "\">\n\
      <circle cx=\"570\" cy=\"400\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"400\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"570\" cy=\"600\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"600\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"430\" cy=\"500\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
      <circle cx=\"570\" cy=\"500\" r=\"40\" stroke=\"black\" fill=\"black\"/>\n\
    </g>\n\
    \n\
    Sorry, your browser does not support inline SVG.\n\
    </svg>\n\
    "
    return imageString


main()
