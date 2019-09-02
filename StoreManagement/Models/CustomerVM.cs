﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using StoreManagement.DAL;

namespace StoreManagement.Models
{
    [MetadataType(typeof(CustomerMetaData))]
    public partial class Customer
	{

    }

    public class CustomerMetaData
    {
        [DisplayAttribute(Name = "Customer Name")]
        public string Name { get; set; }
     }
}