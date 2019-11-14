# 1. All single properties
# 2. 3 categories with 3 properties each
# 3. 4 categories with 3 properties each

# After svg generation
# gimp batchprocessing -> select all svg -> output: png
# mogrify -trim +repage *


def main():
    colors = [["purple", "mediumpurple"], ["darkorange", "peachpuff"], ["darkturquoise", "aquamarine"]]
    shapes = ["square", "circle", "triangle"]
    fillings = ["none", "url(#stripe)", "url(#dotted)"]
    numbers = ["one", "two", "three"]

    for single in [True, False]:
        if single:
            for shape in shapes:
                square = "none"
                circle = "none"
                triangle = "none"
                ellipse = "none"
                one = "none"
                two = "none"
                three = "none"
                four = "none"

                filling = "none"

                [colordefault, colordark] = colors[0]

                if shape == "square":
                    square = "inherit"
                elif shape == "circle":
                    circle = "inherit"
                else:
                    triangle = "inherit"

                imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, filling, one, two,
                                     three, four)

                with open("images/svg/" + shape + ".svg", "w+") as file:
                    file.write(imageString)

            for [colordefault, colordark] in colors:
                square = "inherit"
                circle = "none"
                triangle = "none"
                ellipse = "none"
                one = "none"
                two = "none"
                three = "none"
                four = "none"

                filling = "none"

                imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, filling, one, two,
                                     three, four)

                with open("images/svg/" + colordefault + ".svg", "w+") as file:
                    file.write(imageString)

            for filling in fillings:
                square = "inherit"
                circle = "none"
                triangle = "none"
                ellipse = "none"
                one = "none"
                two = "none"
                three = "none"
                four = "none"

                [colordefault, colordark] = colors[0]

                fillingname = "full"
                if filling != "none":
                    fillingname = filling[5:len(filling) - 1]

                imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, filling, one, two,
                                     three, four)

                with open("images/svg/" + fillingname + ".svg", "w+") as file:
                    file.write(imageString)

            for number in numbers:
                square = "inherit"
                circle = "none"
                triangle = "none"
                ellipse = "none"
                one = "none"
                two = "none"
                three = "none"
                four = "none"

                filling = "none"

                [colordefault, colordark] = colors[0]

                if number == "one":
                    one = "inherit"
                elif number == "two":
                    two = "inherit"
                elif number == three:
                    three = "inherit"
                else:
                    four = "inherit"

                imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, filling, one, two,
                                     three, four)

                with open("images/svg/" + number + ".svg", "w+") as file:
                    file.write(imageString)

            continue

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
                        one = "none"
                        two = "none"
                        three = "none"
                        four = "none"

                        if shape == "square":
                            square = "inherit"
                        elif shape == "circle":
                            circle = "inherit"
                        else:
                            triangle = "inherit"

                        if number == "one":
                            one = "inherit"
                        elif number == "two":
                            two = "inherit"
                        else:
                            three = "inherit"

                        fillingname = "full"
                        if filling != "none":
                            fillingname = filling[5:len(filling) - 1]

                        imageString = imgStr(colordefault, colordark, square, circle, triangle, ellipse, filling, one,
                                             two, three, four)

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


def imgStr(colordefault, colordark, square, circle, triangle, ellipse, filling, one, two, three, four):
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
    \n\
    Sorry, your browser does not support inline SVG.  \n\
    </svg>\n\
    "
    return imageString


main()
