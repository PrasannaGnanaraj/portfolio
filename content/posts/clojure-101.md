---
title: I just created a TODO cli with clojure
description: My first post
date: 2020-08-23
---

Recently I decided to learn clojure, a functional programming language. In this blog I've documented my experience with creating a standalone todo client using clojure.

I began by creating a new project using [Leiningen](https://leiningen.org/).

> Leiningen is the easiest way to use Clojure. With a focus on project automation and declarative configuration, it gets out of your way and lets you focus on your code.

```bash
$ lein new app todo-cli
```

The above command asks Leiningen to create a new project based on application project template.

### Folder Structure

Lets take a look at the project folder structure

```
.
├── CHANGELOG.md
├── doc
│   └── intro.md
├── example.txt
├── hello.txt
├── LICENSE
├── project.clj
├── README.md
├── resources
├── src
│   └── todo
│       └── core.clj
└── test
    └── todo
        └── core_test.clj
```

The main application logic lies under src/todo/core.clj

```clojure
(ns todo.core
  (:gen-class)
  (:require [clojure.string :refer [split]])
  (:require [clojure.java.io :refer [writer reader]]))

(use 'clojure.pprint)

(def file-location (System/getenv "TODO_LOCATION"))

(defn now [] (new java.util.Date))

(defn add-content
  "appends content to todo file"
  [file-location text-content]
  (with-open [file (writer file-location :append true)]
    (.write file (str text-content "\t" (now) "\n"))))

(defn print-helper
  "Converts line content to a row obj"
  [line-content]
  (let [[todo created_at] (split line-content #"\t")]
    {:todo todo :created_at (or created_at "UNKNOWN")}))

(defn read-content
  "reads content from todo file"
  [file-location]
  (with-open [file (reader file-location)]
    (let [file-content (slurp file)]
      (print-table
       (map print-helper
            (split file-content #"\n"))))))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (if (nil? file-location)
    (throw (AssertionError. "empty $TODO_LOCATION")))
  (case (first args)
    "a" (do
          (add-content file-location (second args))
          (read-content file-location))
    "ls" (read-content file-location)
    (println "Choose either a or ls")))
```

Before going into what each function means, lets see what the app can do

```bash
$ lein run a "practise clojure"

|            :todo |                  :created_at |
|------------------+------------------------------|
| practise clojure | Fri Jul 24 17:51:27 BST 2020 |

$ lein run ls

|            :todo |                  :created_at |
|------------------+------------------------------|
| practise clojure | Fri Jul 24 17:51:27 BST 2020 |
```

### Running the application

Running `lein run` executes the `-main` function and passes the command line arguments to it.There are two actionable commands that you can pass to the main function

**a :** adds text content to to-do's

**ls**: Lists all the to-do's

Lets have a look at what each function does. I have two functions handling the main use cases of the application

### add-content

Function accepts a file location and text content as arguments.It then writes the text content to a file along with the time at which the content was added. Contents are separated by tab and a newline is added at the end.

### read-content

Function accepts a file location as argument.It then reads all the file contents using `slurp` . Splits every line in content then prints the results

I have a couple of helper functions too

### now

Function spits out a new date object whenever it gets called

### print-helper

Function helps converting text content into a map so that I can print my to-do content in a table format

### Building the app

To package up the project files and dependencies into a jar file, you can run

```bash
$ lein uberjar
Compiling todo.core
Created /mnt/d/todo-cli/target/uberjar/todo-0.1.0-SNAPSHOT.jar
Created /mnt/d/todo-cli/target/uberjar/todo-0.1.0-SNAPSHOT-standalone.jar
```

You can then run the app using

```bash
$ java -jar target/uberjar/todo-0.1.0-SNAPSHOT-standalone.jar
```

I noticed it was pretty tedious to run the built app this way. It would be pretty cool if we could run our app stand alone without having to invoke `java -jar` every time.

I searched for a solution that could make this possible and found [lein-bin](https://github.com/Raynes/lein-bin#lein-bin).

> Leiningen plugin for producing standalone console executables that work on OS X, Linux, and Windows.
> It basically just takes your uberjar and stuffs it in another file with some fancy magical execution stuff.

I added lein-bin to my ~/.lein/profiles.clj.

```clojure
{:user {:plugins [[lein-bin "0.3.5"]]}}
```

Modified my ./project.clj to look like below

```clojure
(defproject todo "0.1.0-SNAPSHOT"
  :description "a todo cli"
  :url "https://github.com/PrasannaGnanaraj/todo-cli"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.1"]]
  :main ^:skip-aot todo.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}}
  :bin {:name "todo"
        :bin-path "~/bin"
        :bootclasspath true})
```

with the :bin key you can specify the name of your standalone executable , the path in which you would like your executable to be placed

After which if you run

```clojure
$ lein bin                                                                                                                                                                                  ok | at 18:24:21
Compiling todo.core
Created /mnt/d/todo-cli/target/uberjar/todo-0.1.0-SNAPSHOT.jar
Created /mnt/d/todo-cli/target/uberjar/todo-0.1.0-SNAPSHOT-standalone.jar
Creating standalone executable: /mnt/d/todo-cli/target/default/todo
Copying binary to #object[java.io.File 0x7c40ffef /home/user/bin]
```

you will then be able to use the application like a stand alone executable like

```clojure
$ todo a "practise clojure"
|            :todo |                  :created_at |
|------------------+------------------------------|
| practise clojure | Fri Jul 24 17:51:27 BST 2020 |
```

Overall I found Clojure and its functional programming paradigms help you make software that has

- Clear separation in terms of responsibilities
- Easy to modify/refactor/build on top of
- Easy to Understand / Debug

I would continue learning and exploring Clojure by trying to apply Clojure to real life software problems.

You can find the source code in Github [here](https://github.com/PrasannaGnanaraj/todo-cli)

Also , Ive found this book incredibly useful in my clojure learning path.
[Learn to Program the World's Most Bodacious Language with Clojure for the Brave and True](https://www.braveclojure.com/clojure-for-the-brave-and-true/)
