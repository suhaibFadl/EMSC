using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EMSC.Models
{
    public partial class EMSCDBContext : IdentityDbContext<IdentityUser>
    {
        //public EMSCDBContext()
        //{
        //}

        public EMSCDBContext(DbContextOptions<EMSCDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<SupervisorCountries> SupervisorCountries { get; set; }
        public virtual DbSet<Branches> Branches { get; set; }
        public virtual DbSet<BranchesUsers> BranchesUsers { get; set; }
        public virtual DbSet<Patients> Patients { get; set; }
        public virtual DbSet<PatientHosp> PatientHosps { get; set; }
        public virtual DbSet<Hospitals> Hospitals { get; set; }
        public virtual DbSet<Countries> Countries { get; set; }
        public virtual DbSet<RepliesBr> RepliesBr { get; set; }
        public virtual DbSet<HospsCountr> HospsCountr { get; set; }
        public virtual DbSet<PatientsData> PatientsData { get; set; }
        public virtual DbSet<PatientsTransactions> PatientsTransactions { get; set; }
        public virtual DbSet<TreatmentMovements> TreatmentMovements { get; set; }
        public virtual DbSet<HotelMovements> HotelMovements { get; set; }
        public virtual DbSet<TravelingProcedures> TravelingProcedures { get; set; }
        public virtual DbSet<PatientsTransactionsInside> PatientsTransactionsInside { get; set; }
        public virtual DbSet<RepliesManagement> RepliesManagement { get; set; }
        public virtual DbSet<HospitalsUsers> HospitalsUsers { get; set; }
        public virtual DbSet<RepliesHospitals> RepliesHospitals { get; set; }
        public virtual DbSet<HotelsOutside> HotelsOutside { get; set; }
        public virtual DbSet<MedicalFileStatus> MedicalFileStatus { get; set; }
        public virtual DbSet<TravelersBack> TravelersBack { get; set; }
        public virtual DbSet<Dependency> Dependency { get; set; }
        public virtual DbSet<InjuryEvents> InjuryEvents { get; set; }
        public virtual DbSet<Pats_Referred> Pats_Referred { get; set; }
        public virtual DbSet<TreatmentMovementsInside> TreatmentMovementsInside { get; set; }
        public virtual DbSet<MedicalFilesInside> MedicalFilesInside { get; set; }
        public virtual DbSet<Pats_Tickets_Rejected> Pats_Tickets_Rejected { get; set; }
        public virtual DbSet<Housing_Letters> Housing_Letters { get; set; }
        public virtual DbSet<Hotels_Entry_Procedures> Hotels_Entry_Procedures { get; set; }
        public virtual DbSet<Hotels_Renewal_Precedures> Hotels_Renewal_Precedures { get; set; }
        public virtual DbSet<Hotels_Leaving_Procedures> Hotels_Leaving_Procedures { get; set; }
        public virtual DbSet<Medications> Medications { get; set; }
        public virtual DbSet<DispensingMedication> DispensingMedication { get; set; }
        public virtual DbSet<Pharmacies> Pharmacies { get; set; }
        public virtual DbSet<PharmaciesUsers> PharmaciesUsers { get; set; }
        public virtual DbSet<Cities> Cities { get; set; }
        public virtual DbSet<Batches> Batches { get; set; }
        public virtual DbSet<PricesLists> PricesLists { get; set; }
        public virtual DbSet<MedicalServices> MedicalServices { get; set; }
        public virtual DbSet<ServicesLists> ServicesLists { get; set; }
        public virtual DbSet<Claims> Claims { get; set; }
        public virtual DbSet<ClaimsServices> ClaimsServices { get; set; }
        public virtual DbSet<HospitalRanks> HospitalRanks { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseSqlServer("Server=.;Database=MalingSystem;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IdentityRole>().HasData(
                  new { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
                  new { Id = "2", Name = "الإدارة", NormalizedName = "الإدارة" },
                  new { Id = "3", Name = "مشرف عام", NormalizedName = "مشرف عام" },
                  new { Id = "4", Name = "مشرف طبي", NormalizedName = "مشرف طبي" },
                  new { Id = "5", Name = "مشرف إداري", NormalizedName = "مشرف إداري" }
              );
           

          
            modelBuilder.Entity<SupervisorCountries>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CountryId).HasColumnName("countryId");

                entity.Property(e => e.UserId).HasColumnName("userId");
            });

         
            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
